import Cookies from 'js-cookie'

type Theme = 'light' | 'dark'

const setTheme = (theme: Theme, noSetCookie?: boolean): void => {
  const $html = document.getElementsByTagName('html')[0]
  if (theme === 'dark') $html.classList.add(theme)
  else $html.classList.remove('dark')

  if (noSetCookie === true) return
  const expires = 365 * 100
  Cookies.set('theme', theme, { sameSite: 'strict', expires })
}

export const switchTheme = (): void => {
  const cookieTheme = Cookies.get('theme')
  if (cookieTheme === undefined) setTheme('dark')
  else if (cookieTheme === 'light') setTheme('dark')
  else if (cookieTheme === 'dark') setTheme('light')
}

export const getThemeSaved = (): void => {
  const cookieTheme = Cookies.get('theme')
  if (cookieTheme === undefined) return
  if (cookieTheme === 'light') setTheme('light', true)
  else if (cookieTheme === 'dark') setTheme('dark', true)
}
