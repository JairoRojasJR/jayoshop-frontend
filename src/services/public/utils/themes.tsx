import Cookies from 'js-cookie'

type Theme = 'light' | 'dark'

enum ThemeColorsNames {
  Primary = '--primary',
  Secondary = '--secondary',
  DarkPrimary = '--darkprimary',
  DarkSecondary = '--darksecondary',
  PrimaryFontColor = '--primaryfontcolor',
  SecondaryFontColor = '--secondaryfontcolor',
  BlueGrayPrimary = '--bluegrayprimary',
  BlueGraySecondary = '--bluegraysecondary',
  PrimaryTrans = '--primary-trans',
  SecondaryTrans = '--secondary-trans',
  PrimaryFlash = '--primary-flash',
  SecondaryFlash = '--secondary-flash'
}

type MinHexadecial = `${string}${string}${string}`
type Hexadecimal = `#${MinHexadecial}${MinHexadecial}`

type ThemeColors = Record<ThemeColorsNames, Hexadecimal>

const setTheme = (theme: Theme, noSetCookie?: boolean): void => {
  const defaultTheme: ThemeColors = {
    [ThemeColorsNames.Primary]: '#1b1b3b',
    [ThemeColorsNames.Secondary]: '#efefef',
    [ThemeColorsNames.DarkPrimary]: '#0b0b2b',
    [ThemeColorsNames.DarkSecondary]: '#f8f8f8',
    [ThemeColorsNames.PrimaryFontColor]: '#efefef',
    [ThemeColorsNames.SecondaryFontColor]: '#1b1b3b',
    [ThemeColorsNames.BlueGrayPrimary]: '#1b1b3b',
    [ThemeColorsNames.BlueGraySecondary]: '#3b3b5b',
    [ThemeColorsNames.PrimaryTrans]: '#1b1b3bdd',
    [ThemeColorsNames.SecondaryTrans]: '#efefefdd',
    [ThemeColorsNames.PrimaryFlash]: '#fff3',
    [ThemeColorsNames.SecondaryFlash]: '#000c'
  }

  let outputThemeName = 'dark'

  if (theme === 'dark') {
    outputThemeName = 'dark'
  } else if (theme === 'light') {
    const defautlThemeArray = Object.entries(defaultTheme)

    defautlThemeArray.forEach((theme, index) => {
      if (theme[0].includes('primary')) {
        Object.assign(defaultTheme, {
          [theme[0]]: defautlThemeArray[index + 1][1]
        })
      } else if (theme[0].includes('secondary')) {
        Object.assign(defaultTheme, theme[0], {
          [theme[0]]: defautlThemeArray[index - 1][1]
        })
      }
    })
    outputThemeName = 'light'
  }

  const documentHTML = document.documentElement

  for (const property in defaultTheme) {
    const color = defaultTheme[property as keyof ThemeColors]
    documentHTML.style.setProperty(property, color)
  }

  if (noSetCookie === true) return
  const expires = 365 * 100
  Cookies.set('theme', outputThemeName, { sameSite: 'strict', expires })
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
