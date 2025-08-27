import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const tokenFromStorage = localStorage.getItem('pt_token')
  const userFromStorage = localStorage.getItem('pt_user')
  const [token, setToken] = useState(tokenFromStorage || null)
  const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : null)

  const login = (userObj, token) => {
    setToken(token)
    setUser(userObj)
    localStorage.setItem('pt_token', token)
    localStorage.setItem('pt_user', JSON.stringify(userObj))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('pt_token')
    localStorage.removeItem('pt_user')
  }

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
