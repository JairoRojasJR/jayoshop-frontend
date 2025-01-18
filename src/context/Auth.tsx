'use client'

import { createContext, useContext } from 'react'
import { type Initial, type UseAuth, useAuth } from '@/hooks/auth'

export interface Provider {
  children: React.ReactNode
  initial: Initial
}

const AuthContext = createContext<UseAuth>(undefined as unknown as UseAuth)

export default function AuthProvider({
  children,
  initial
}: Provider): JSX.Element {
  const auth = useAuth(initial)

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext(): UseAuth {
  return useContext(AuthContext)
}
