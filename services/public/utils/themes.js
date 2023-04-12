import Cookies from 'js-cookie'

const setTheme = (theme, noSetCookie) => {
  if (!theme) throw new Error('Se requiere el parámetro theme')
  const darkTheme = {
    '--primary': '#1b1b3b',
    '--secondary': '#efefef',
    '--darkprimary': '#0b0b2b',
    '--darksecondary': '#f8f8f8',
    '--primaryfontcolor': '#efefef',
    '--secondaryfontcolor': '#1b1b3b',
    '--bluegrayprimary': '#1b1b3b',
    '--bluegraysecondary': '#3b3b5b'
  }

  let outputTheme = {}
  let outputThemeName

  if (theme === 'dark') {
    outputTheme = darkTheme
    outputThemeName = 'dark'
  } else if (theme === 'light') {
    const darkThemeArray = Object.entries(darkTheme)

    for (const indice in darkThemeArray) {
      const cursor = parseInt(indice)
      const values = darkThemeArray[cursor]
      const property = values[0]

      if (property.includes('primary')) {
        outputTheme[property] = darkThemeArray[cursor + 1][1]
      } else if (property.includes('secondary')) {
        outputTheme[property] = darkThemeArray[cursor - 1][1]
      }
    }
    outputThemeName = 'light'
  } else {
    const error = `El parámetro theme tiene que ser dark o light, se recibió: ${theme}`
    throw new Error(error)
  }

  const documentHTML = document.documentElement
  for (const property in outputTheme) {
    const color = outputTheme[property]
    documentHTML.style.setProperty(property, color)
  }

  if (noSetCookie) return
  const expires = 365 * 100
  Cookies.set('theme', outputThemeName, { sameSite: 'strict', expires })
}

export const switchTheme = () => {
  const cookieTheme = Cookies.get('theme')
  if (!cookieTheme) setTheme('dark')
  else if (cookieTheme === 'light') setTheme('dark')
  else if (cookieTheme === 'dark') setTheme('light')
}

export const getThemeSaved = () => {
  const cookieTheme = Cookies.get('theme')
  if (!cookieTheme) return
  if (cookieTheme === 'light') setTheme('light', true)
  else if (cookieTheme === 'dark') setTheme('dark', true)
}
