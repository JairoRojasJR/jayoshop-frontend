import React, { useEffect, useRef, useState } from 'react'
import Router from 'next/router'
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
          to: { transform: 'translateX(0)' }
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
      await Router.push('/login')
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
    const maxWidthToMenu = 500
    const turnOff = windowWidth > maxWidthToMenu && statusMenu === 'open'
    const turnOn = windowWidth < maxWidthToMenu && statusMenu === 'unavailable'

    if (turnOff) switchMenu(true)
    else if (turnOn) setStatusMenu('close')
    else if (windowWidth > maxWidthToMenu) setStatusMenu('unavailable')
  }, [windowWidth])

  // Html content required
  const menuContainerClassName = (): string => {
    const onMenuAvailable = 'pf tp0 lf0 w100p h100p owxA menuContainer'
    return `df gpM lsN ${menuAvailable ? onMenuAvailable : ''}`
  }

  const divMenuContainerClassName = (): string => {
    const onMenuAvailable = 'w100p h100p df jcfe minWD'
    return `df gpM lsN ${menuAvailable ? onMenuAvailable : ''}`
  }

  const menuClassName = (): string => {
    const onMenuAvailable = 'fdc h100p tp0 rt0 bcBgp owA crL menu'
    return `df gpM lsN ${menuAvailable ? onMenuAvailable : ''}`
  }

  const hrefUser = (): string => {
    if (isAdminAuthenticated) return '/admin/inventario'
    else if (isAuthenticated) return '/'
    else return '/login'
  }

  // Component required
  type NavOptionsProps = {
    children: string
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
    let classNames = 'df aic cp gpM'
    const optionStyles: React.CSSProperties = {
      fontSize: '1.5rem',
      padding: '.5rem'
    }
    if (menuAvailable) {
      classNames += ' bcBgs'
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
    <nav ref={navRef} className='pf w100p df aic jcsb bcDp pgM'>
      <section
        className='bcP pgyML pgxL brM'
        style={{ fontSize: '1.7rem', padding: 'var(--remM) var(--remL)' }}
      >
        <Link href='/' className='df aic cp gpM'>
          <Image src='/tienda.png' width={50} height={50} alt='JayoShop' />
          <span className='fwB fsI'>JayoShop</span>
        </Link>
      </section>
      {menuAvailable ? (
        <section>
          <button
            className='cp bcT pgM crS'
            style={{ fontSize: '2rem' }}
            onClick={switchMenu}
          >
            <Bars stroke='var(--darksecondary)' />
          </button>
        </section>
      ) : null}
      <section className={menuAvailable ? 'pf' : ''}>
        {menuAvailable ? (
          <article
            ref={menuBackgroundRef}
            className='pf w100p h100p tp0 lf0 menuBackground invisible'
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
              <section>
                <button
                  className='pa w100p h100p tp0 lf0 bcT'
                  onClick={statusMenu !== 'running' ? switchMenu : () => {}}
                />
              </section>
            ) : null}
            <ul className={menuClassName()}>
              {menuAvailable ? (
                <li className='df aic bcBgs' style={{ height: '90px' }}>
                  <button
                    className='cp bcT pgM crS crL'
                    style={{ fontSize: '2rem', marginLeft: 'var(--remM)' }}
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
              <NavOption href='/carrito' Icon={ShoppingCar}>
                Carrito
              </NavOption>
              <NavOption href={hrefUser()} Icon={User}>
                User
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
                >
                  Cerrar sesión
                </NavOption>
              ) : null}
              <NavOption Icon={Sun} isButton={true} run={switchTheme}>
                Tema
              </NavOption>
            </ul>
          </div>
        </article>
      </section>
      <style jsx>{`
        nav {
          height: 90px;
          z-index: 1000;
          min-width: var(--minWDisplay);
        }

        .menuBackground {
          background: #000b;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .menuContainer {
          transform: translateX(100vw);
          transition: transform 0.5s;
        }

        .menu {
          width: 60vw;
          z-index: 950;
          min-width: 200px;
        }
      `}</style>
    </nav>
  )
}
