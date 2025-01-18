import { BACKEND_API } from '@/app/consts'
import type { AuthData, Login, ChangeAuthStatus } from '@/types/server'
import axios from 'axios'

const AUTH_PATH = `${BACKEND_API}/auth`

export const getAuth = async (Cookie: string): Promise<AuthData> => {
  const req = await fetch(`${AUTH_PATH}/checking`, { headers: { Cookie } })
  return await req.json()
}

export const login = async (data: Login): Promise<ChangeAuthStatus> => {
  const req = await axios.post(`${AUTH_PATH}/login`, data, {
    withCredentials: true
  })

  return req.data
}

export const logout = async (): Promise<ChangeAuthStatus> => {
  const req = await axios(`${AUTH_PATH}/logout`, { withCredentials: true })
  return req.data
}

export default { getAuth, login, logout }
