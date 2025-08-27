const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

dotenv.config();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT,
    password_hash TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT,
    parent_id INTEGER,
    FOREIGN KEY(parent_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER,
    title TEXT,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(teacher_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    teacher_id INTEGER,
    date TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES users(id),
    FOREIGN KEY(teacher_id) REFERENCES users(id)
  )`);
});

const app = express();
app.use(cors());
app.use(express.json());

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing authorization header' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  const password_hash = bcrypt.hashSync(password, 8);
  const stmt = db.prepare('INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)');
  stmt.run(name, email, role, password_hash, function(err) {
    if (err) {
      return res.status(400).json({ error: 'Email already exists or invalid input' });
    }
    const user = { id: this.lastID, name, email, role };
    const token = signToken(user);
    res.json({ user, token });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const user = { id: row.id, name: row.name, email: row.email, role: row.role };
    const token = signToken(user);
    res.json({ user, token });
  });
});

app.get('/api/announcements', (req, res) => {
  db.all('SELECT a.*, u.name as teacher_name FROM announcements a LEFT JOIN users u ON a.teacher_id = u.id ORDER BY a.created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/announcements', authMiddleware, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Only teachers can post announcements' });
  const { title, content } = req.body;
  const stmt = db.prepare('INSERT INTO announcements (teacher_id, title, content) VALUES (?, ?, ?)');
  stmt.run(req.user.id, title, content, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    db.get('SELECT a.*, u.name as teacher_name FROM announcements a LEFT JOIN users u ON a.teacher_id = u.id WHERE a.id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.json(row);
    });
  });
});

app.post('/api/students', authMiddleware, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Only teachers can create students' });
  const { name, grade, parent_id } = req.body;
  const stmt = db.prepare('INSERT INTO students (name, grade, parent_id) VALUES (?, ?, ?)');
  stmt.run(name, grade, parent_id, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    db.get('SELECT * FROM students WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.json(row);
    });
  });
});

app.get('/api/students/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

app.post('/api/meetings', authMiddleware, (req, res) => {
  if (req.user.role !== 'parent') return res.status(403).json({ error: 'Only parents can request meetings' });
  const { teacher_id, date } = req.body;
  const stmt = db.prepare('INSERT INTO meetings (parent_id, teacher_id, date) VALUES (?, ?, ?)');
  stmt.run(req.user.id, teacher_id, date, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    db.get('SELECT * FROM meetings WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.json(row);
    });
  });
});

app.get('/api/meetings', authMiddleware, (req, res) => {
  const user = req.user;
  if (user.role === 'parent') {
    db.all('SELECT m.*, u1.name as parent_name, u2.name as teacher_name FROM meetings m LEFT JOIN users u1 ON m.parent_id = u1.id LEFT JOIN users u2 ON m.teacher_id = u2.id WHERE m.parent_id = ? ORDER BY m.created_at DESC', [user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
  } else if (user.role === 'teacher') {
    db.all('SELECT m.*, u1.name as parent_name, u2.name as teacher_name FROM meetings m LEFT JOIN users u1 ON m.parent_id = u1.id LEFT JOIN users u2 ON m.teacher_id = u2.id WHERE m.teacher_id = ? ORDER BY m.created_at DESC', [user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});

app.put('/api/meetings/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Only teachers can update meeting status' });
  const id = req.params.id;
  const { status } = req.body;
  db.run('UPDATE meetings SET status = ? WHERE id = ? AND teacher_id = ?', [status, id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    db.get('SELECT * FROM meetings WHERE id = ?', [id], (err2, row) => {
      if (err2 || !row) return res.status(404).json({ error: 'Meeting not found' });
      res.json(row);
    });
  });
});

app.post('/api/_seed', (req, res) => {
  db.serialize(() => {
    const users = [
      { name: 'Ms. Lebo', email: 'teacher@example.com', role: 'teacher', password: 'password' },
      { name: 'Mr. Parent', email: 'parent@example.com', role: 'parent', password: 'password' }
    ];
    const insert = db.prepare('INSERT OR IGNORE INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)');
    users.forEach(u => {
      const hash = bcrypt.hashSync(u.password, 8);
      insert.run(u.name, u.email, u.role, hash);
    });
    insert.finalize(() => {
      res.json({ ok: true });
    });
  });
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
