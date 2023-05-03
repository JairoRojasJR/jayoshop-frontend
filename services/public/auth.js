import Cookies from 'js-cookie'

export const getAuthData = async () => {
  const url = `${globalThis.backendUrl}/api/auth/check`
  const req = await fetch(url, { credentials: 'include' })
  if (req.status === 200) return await req.json()
  throw new Error('Error interno en el servidor')
}

export const login = async data => {
  const url = `${globalThis.backendUrl}/api/auth/login`
  const req = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const res = await req.json()
  if (res.error) throw new Error(res.error)

  const { authData } = res
  const { rol, isAuthenticated } = authData
  const expires = 365 * 100

  Cookies.set('auth', `${rol}-${isAuthenticated}`, {
    sameSite: 'strict',
    expires
  })

  return authData
}

export const logout = async () => {
  const url = `${globalThis.backendUrl}/api/auth/logout`
  const req = await fetch(url, { credentials: 'include' })
  const res = await req.json()

  if (res.error) throw new Error(res.error)
  const { authData } = res
  const { rol, isAuthenticated } = authData
  const expires = 365 * 100

  Cookies.set('auth', `${rol}-${isAuthenticated}`, {
    sameSite: 'strict',
    expires
  })

  return authData
}
