'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useIsAuthContext } from '@/context/isAuth'
import { runTransition } from '@/services/public/utils/transition'
import { switchTheme } from '@/services/public/utils/themes'
import { logout } from '@/services/public/auth'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { debounce } from 'lodash'
import Bars from '@/svg/Bars'
import Home from '@/svg/Home'
import Basket from '@/svg/Basket'
import ShoppingCar from '@/svg/Shopping-car'
import User from '@/svg/User'
import Packages from '@/svg/Packages'
import Logout from '@/svg/Logout'
import Sun from '@/svg/Sun'
import type { Toggle, Transitions } from '@/types'

export default function Nav(): React.ReactElement {
  const [windowWidth, setWindowWidth] = useState(0)
  const [statusMenu, setStatusMenu] = useState('close')
  const { isAuthContext, setIsAuthContext } = useIsAuthContext()
  const { isAdminAuthenticated, isAuthenticated } = isAuthContext
  const router = useRouter()

  const navRef = useRef(null)
  const menuBackgroundRef = useRef(null)
  const menuContainerRef = useRef(null)
  const menuAvailable = statusMenu !== 'unavailable'

  const switchMenu = (
    turnOff?: boolean | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const background = menuBackgroundRef.current
    const menu = menuContainerRef.current

    if (background === null || menu === null) return

    let newStatus: 'close' | 'open' | 'unavailable' = 'close'
    if (turnOff === true) newStatus = 'unavailable'
    else if (statusMenu === 'open') newStatus = 'close'
    else if (statusMenu === 'close') newStatus = 'open'
    else newStatus = 'close'
    setStatusMenu('running')

    let toggle: Toggle
    if (newStatus === 'open') {
      document.body.classList.add('no-scroll')
      toggle = 1
    } else {
      document.body.classList.remove('no-scroll')
      toggle = 0
    }

    const transitions: Transitions = [
      {
        element: background,
        properties: {
          from: { background: 'var(--primary-flash)', opacity: 0 },
          to: { background: '#0008', opacity: 1 }
        },
        display: 'run'
      },
      {
        element: menu,
        properties: {
          from: { transform: 'translateX(100vw)' },
          to: { transform: 'translateX(0vw)' }
        }
      }
    ]

    runTransition(transitions, toggle)
      .then(() => {
        setStatusMenu(newStatus)
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  const handleClickLogoutBtn = (): void => {
    const runLogout = async (): Promise<void> => {
      const authData = await logout()
      setIsAuthContext(authData)
      router.push('/login')
    }

    jtoast('Cerrando sesión', {
      onAsyncEvents: {
        isAsync: true,
        callback: runLogout,
        onSuccess: 'Sesión cerrada'
      }
    })
  }

  const handleWindowResize = debounce(() => {
    setWindowWidth(window.innerWidth)
  }, 100)

  useEffect(() => {
    if (navRef.current !== null) globalThis.navMainHTML = navRef.current
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  useEffect(() => {
    const maxWidthToMenu = 750
    const turnOff = windowWidth > maxWidthToMenu && statusMenu === 'open'
    const turnOn = windowWidth < maxWidthToMenu && statusMenu === 'unavailable'

    if (turnOff) switchMenu(true)
    else if (turnOn) setStatusMenu('close')
    else if (windowWidth > maxWidthToMenu) setStatusMenu('unavailable')
  }, [windowWidth])

  // Html content required
  const menuContainerClassName = (): string => {
    const onMenuAvailable =
      'fixed top-0 left-0 w-full h-full overflow-x-auto translate-x-full transition duration-500'
    return `df gap-2 list-none ${menuAvailable ? onMenuAvailable : ''}`
  }

  const divMenuContainerClassName = (): string => {
    const onMenuAvailable = 'w-full h-full flex justify-end min-w-[350px]'
    return `flex gap-2 list-none ${menuAvailable ? onMenuAvailable : ''}`
  }

  const menuClassName = (): string => {
    const onMenuAvailable =
      'flex-col h-full top-0 right-0 bg-dark-300 dark:bg-dark-100 overflow-auto text-light-100 w-[60vw] z-40 min-w-[200px]'
    return `flex gap-2 list-none ${menuAvailable ? onMenuAvailable : ''}`
  }

  const hrefUser = (): string => {
    if (isAdminAuthenticated) return '/admin/inventario'
    else if (isAuthenticated) return '/'
    else return '/login'
  }

  // Component required
  type NavOptionsProps = {
    children?: string
    Icon: React.JSX.ElementType
    href?: string
    isButton?: boolean
    run?: () => void
  }

  function NavOption({
    children,
    Icon,
    href,
    isButton,
    run
  }: NavOptionsProps): JSX.Element {
    let classNames = 'flex items-center cursor-pointer gap-2'
    const optionStyles: React.CSSProperties = {
      fontSize: '1.1rem',
      padding: '.5rem'
    }
    if (menuAvailable) {
      classNames += ' dark:bg-dark-300 bg-dark-100'
      optionStyles.height = '50px'
    }

    return (
      <li>
        {href !== undefined && isButton !== true ? (
          <Link href={href} className={classNames} style={optionStyles}>
            <Icon />
            <span>{children}</span>
          </Link>
        ) : (
          <div className={classNames} style={optionStyles} onClick={run}>
            <Icon />
            <span>{children}</span>
          </div>
        )}
      </li>
    )
  }

  return (
    <nav
      ref={navRef}
      className='fixed z-[1000] flex h-[90px] w-full min-w-[350px] items-center justify-between bg-light-200 p-2 transition duration-300 dark:bg-dark-200'
    >
      <section className='rounded-lg bg-light-100 px-5 py-3 text-2xl dark:bg-dark-100'>
        <Link href='/' className='flex cursor-pointer items-center gap-2'>
          <Image src='/tienda.png' width={50} height={50} alt='JayoShop' />
          <span className='font-bold italic text-dark-200 dark:text-light-200'>
            JayoShop
          </span>
        </Link>
      </section>
      {menuAvailable ? (
        <section>
          <button
            className='cursor-pointer bg-transparent p-2 text-dark-100 dark:text-light-100'
            style={{ fontSize: '2rem' }}
            onClick={switchMenu}
          >
            <Bars />
          </button>
        </section>
      ) : null}
      <section className={menuAvailable ? 'fixed' : ''}>
        {menuAvailable ? (
          <article
            ref={menuBackgroundRef}
            className='invisible fixed left-0 top-0 size-full bg-dark-300 opacity-0 transition duration-500'
          />
        ) : null}
        <article
          ref={menuContainerRef}
          className={menuContainerClassName()}
          style={{
            userSelect: 'none',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
          }}
        >
          <div className={divMenuContainerClassName()}>
            {menuAvailable ? (
              <button
                className='absolute left-0 top-0 size-full bg-transparent'
                onClick={statusMenu !== 'running' ? switchMenu : () => {}}
              />
            ) : null}
            <ul className={menuClassName()}>
              {menuAvailable ? (
                <li
                  className='flex items-center bg-dark-100 dark:bg-dark-300'
                  style={{ height: '90px' }}
                >
                  <button
                    className='ml-2 cursor-pointer bg-transparent p-2 text-4xl text-light-100 dark:text-light-100'
                    onClick={
                      statusMenu !== 'running' && menuAvailable
                        ? switchMenu
                        : () => {}
                    }
                  >
                    <Bars stroke='#FFF' />
                  </button>
                </li>
              ) : null}
              <NavOption href='/' Icon={Home}>
                Inicio
              </NavOption>
              <NavOption href='/productos' Icon={Basket}>
                Productos
              </NavOption>
              {isAdminAuthenticated ? (
                <NavOption href='/admin/inventario' Icon={Packages}>
                  Inventario
                </NavOption>
              ) : null}
              {isAuthenticated ? (
                <NavOption
                  Icon={Logout}
                  isButton={true}
                  run={handleClickLogoutBtn}
                />
              ) : null}
              <NavOption href={hrefUser()} Icon={User} />
              <NavOption href='/carrito' Icon={ShoppingCar} />
              <NavOption Icon={Sun} isButton={true} run={switchTheme} />
            </ul>
          </div>
        </article>
      </section>
    </nav>
  )
}
