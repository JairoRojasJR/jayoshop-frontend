'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/context/Auth'
import cookie from 'cookie'
import style from '@/css/Nav.module.css'

// ----- Icons -----
import Home from '@/svg/Home'
import Bars from '@/svg/Bars'
import Basket from '@/svg/Basket'
import Packages from '@/svg/Packages'
import BasktetUp from '@/svg/BasktetUp'
import User from '@/svg/User'
import ShoppingCar from '@/svg/ShoppingCar'
import Logout from '@/svg/Logout'
import Sun from '@/svg/Sun'
// ----------

export default function Nav(): JSX.Element {
  const { rol, authenticated, logout } = useAuthContext()
  const currentPath = usePathname()

  const switcherRef = useRef<HTMLInputElement | null>(null)

  const setCookie = (newTheme: string): void => {
    const cookieOptions: cookie.CookieSerializeOptions = {
      maxAge: Date.now() + 60 * 60 * 24 * 365 * 100,
      domain: location.hostname.substring(location.hostname.indexOf('.') + 1),
      path: '/'
    }

    document.cookie = cookie.serialize('theme', newTheme, cookieOptions)
  }

  const applyTheme = (): void => {
    const savedTheme = cookie.parse(document.cookie).theme as string | undefined
    const classList = document.documentElement.classList

    const applyLight = savedTheme === 'dark' || savedTheme === undefined
    const newTheme = applyLight ? 'light' : 'dark'
    setCookie(newTheme)
    classList.toggle('light', applyLight)
  }

  useEffect(() => {
    const menu = document.getElementById(style.switchMenu) as HTMLInputElement
    menu.addEventListener('change', e => {
      if (!menu.checked) {
        const navOptions = menu.nextElementSibling as HTMLDivElement
        navOptions?.classList.add(style.nav__options__closed)
        navOptions?.addEventListener('animationend', e => {
          navOptions.classList.remove(style.nav__options__closed)
        })
      }
    })
  }, [])

  useEffect(() => {
    const $switcher = switcherRef.current as unknown as HTMLInputElement
    $switcher.checked = false
  }, [currentPath])

  return (
    <nav
      className={`${style.main__nav} ${currentPath === '/' ? style.nav__home : ''}`}
    >
      <Link href='/' className={style.nav__logo}>
        <span className={style.nav__logo__img} />
        <span className={style.nav__logo__text}>JayoShop</span>
      </Link>
      <label className={style.nav__switch__menu} htmlFor={style.switchMenu}>
        <Bars />
      </label>
      <input
        id={style.switchMenu}
        ref={switcherRef}
        className='nav__switch__menu'
        type='checkbox'
      />
      <div className={style.nav__options}>
        <label
          htmlFor={style.switchMenu}
          className={style.nav__switch__side__menu}
        />
        <ul>
          <li>
            <Link href='/' className={style.nav__option}>
              <Home />
              Inicio
            </Link>
          </li>
          <li>
            <Link href='/productos' className={style.nav__option}>
              <Basket />
              Productos
            </Link>
          </li>
          {rol === 'admin' && (
            <>
              <li className={style.nav__accordion}>
                <label
                  className={style.nav__option}
                  htmlFor='navInventoryAccordion'
                >
                  <Packages />
                  Inventario
                </label>
                <input id='navInventoryAccordion' type='checkbox' />
                <div className={style.expansible}>
                  <Link href='/admin/inventario/productos' scroll={false}>
                    Productos
                  </Link>
                  <Link href='/admin/inventario/secciones' scroll={false}>
                    Secciones
                  </Link>
                </div>
              </li>
              <li>
                <Link href='/admin/vender' className={style.nav__option}>
                  <BasktetUp />
                  Vender
                </Link>
              </li>
            </>
          )}
          <li className={`${style.nav__option} ${style['nav__options-aside']}`}>
            {!authenticated && (
              <Link href='/login' className={style.nav__option__aside}>
                <User />
              </Link>
            )}
            <Link href='/carrito' className={style.nav__option__aside}>
              <ShoppingCar />
            </Link>
            {authenticated && (
              <button className={style.nav__option__aside} onClick={logout}>
                <Logout />
              </button>
            )}
            <button
              className={style.nav__option__aside}
              onClick={applyTheme}
              onContextMenu={e => {
                e.preventDefault()
                const classList = document.documentElement.classList
                setCookie('sys')
                classList.toggle('light', false)
              }}
            >
              <Sun />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
