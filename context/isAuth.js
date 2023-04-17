'use client'
import PropTypes from 'prop-types'
import { createContext, useContext, useState, useEffect } from 'react'
import { jtoast } from '@/packages/jtoast/Jtoast'
import Cookies from 'js-cookie'

const IsAuthContext = createContext()

export function IsAuthContextProvider({ children }) {
  const [isAuthContext, setIsAuthContext] = useState(false)

  let finished = false
  useEffect(() => {
    if (!finished) {
      const url = `${globalThis.backendUrl}/api/auth/check`
      fetch(url, { credentials: 'include' })
        .then(res => res.json())
        .then(authData => {
          jtoast('AuthData obtained')
          const { rol, isAuthenticated } = authData
          const status = `${rol}-${isAuthenticated}`
          const expires = 365 * 100
          const savedCookie = Cookies.get('auth')

          if (status !== savedCookie) {
            Cookies.set('auth', status, {
              sameSite: 'strict',
              expires
            })
          }

          return setIsAuthContext(authData)
        })
        .catch(error => {
          jtoast(error.message)
        })
      finished = true
    }
  }, [])

  return (
    <IsAuthContext.Provider value={{ isAuthContext, setIsAuthContext }}>
      {children}
    </IsAuthContext.Provider>
  )
}

export function useIsAuthContext() {
  return useContext(IsAuthContext)
}

IsAuthContextProvider.propTypes = {
  children: PropTypes.array.isRequired
}
