'use client'
import PropTypes from 'prop-types'
import { createContext, useContext, useState, useEffect } from 'react'
import { getAuthData } from '@/services/public/auth'
import { checkFetchFailed } from '@/services/public/utils/checkFetchFailed'
import { jtoast } from '@/packages/jtoast/Jtoast'
import Cookies from 'js-cookie'

const IsAuthContext = createContext()

export function IsAuthContextProvider({ children }) {
  const [isAuthContext, setIsAuthContext] = useState(false)

  let finished = false
  useEffect(() => {
    if (!finished) {
      const launchAuthData = async () => {
        const authData = await getAuthData()
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
      }

      const handleError = e => {
        let message = e.message
        const fetchFailed = checkFetchFailed(message)
        if (fetchFailed.failed) message = fetchFailed.message
        if (fetchFailed) message = 'Error al conectar al servidor'
        return message
      }

      jtoast('Conectando al servidor', {
        isAsync: true,
        callback: launchAuthData,
        onSuccess: 'Conexión exitosa🔥!',
        handleError
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
