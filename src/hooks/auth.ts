import { useState } from 'react'
import { useRouter } from 'next/navigation'
import utils from '@/services/auth'
import type { AuthData, Login } from '@/types/server'
import { jtoastSync } from '@/lib/local'

export interface UseAuth {
  rol: AuthData['rol']
  authenticated: AuthData['isAuthenticated']
  login: (e: React.FormEvent<HTMLFormElement>) => void
  logout: () => void
}

export type Initial = Pick<UseAuth, 'rol' | 'authenticated'>

export const useAuth = (initial: Initial): UseAuth => {
  const router = useRouter()
  const [auth, setAuth] = useState(initial)

  const login: UseAuth['login'] = async e => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const credentials = Object.fromEntries(formData) as Login

    jtoastSync('Iniciando sesión', async () => {
      const res = await utils.login(credentials)
      const { rol, isAuthenticated: authenticated } = res.authData
      setAuth({ rol, authenticated })
      router.push('/admin/inventario/productos')
      return res
    })
  }

  const logout: UseAuth['logout'] = () => {
    jtoastSync('Cerrando sesión', async () => {
      const res = await utils.logout()
      router.push('/admin/inventario/productos')
      setAuth({ rol: 'client', authenticated: false })
      router.push('/login')
      return res
    })
  }

  const { rol, authenticated } = auth
  return { rol, authenticated, login, logout }
}
