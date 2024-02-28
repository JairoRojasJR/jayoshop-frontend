'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getAuthData } from '@/services/public/auth'
import { checkFetchFailed } from '@/services/public/utils/checkFetchFailed'
import { jtoast } from '@/packages/jtoast/Jtoast'
import Cookies from 'js-cookie'

import type {
  AuthData,
  IsAuthContextType,
  IsAuthContextProviderProps,
  ErrorHandle
} from '@/types'

const defaultAuthData: AuthData = {
  rol: 'client',
  isAdmin: false,
  isIpAdmin: false,
  ip: '',
  cleanIp: '',
  isAuthenticated: false,
  isAdminAuthenticated: false,
  serverStatus: 'connecting'
}

const IsAuthContext = createContext<IsAuthContextType>({
  isAuthContext: defaultAuthData,
  setIsAuthContext: useIsAuthContext
})

export function IsAuthContextProvider({
  children
}: IsAuthContextProviderProps): React.ReactElement {
  const [isAuthContext, setIsAuthContext] = useState<AuthData>(defaultAuthData)

  let finished = false
  useEffect(() => {
    if (!finished) {
      const launchAuthData = async (): Promise<void> => {
        const authData = await getAuthData()
        const { rol, isAuthenticated } = authData
        authData.serverStatus = 'connected'
        const status = `${rol}-${isAuthenticated}`
        const expires = 365 * 100
        const savedCookie = Cookies.get('auth')

        if (status !== savedCookie) {
          Cookies.set('auth', status, {
            sameSite: 'strict',
            expires
          })
        }

        setIsAuthContext(authData)
      }

      const handleError = (e: ErrorHandle): string => {
        defaultAuthData.serverStatus = 'failed'
        let message = e.message
        const fetchFailed = checkFetchFailed(message)
        if (fetchFailed) message = 'Error al conectar al servidor'
        return message
      }

      jtoast('Conectando al servidor', {
        onAsyncEvents: {
          isAsync: true,
          callback: launchAuthData,
          onSuccess: 'Conexión exitosa🔥!',
          handleError
        }
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

export function useIsAuthContext(): IsAuthContextType {
  return useContext(IsAuthContext)
}
