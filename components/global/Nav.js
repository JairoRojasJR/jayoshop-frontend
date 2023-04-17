import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useIsAuthContext } from '@/context/isAuth'
import { runTransition } from '@/services/public/utils/transition'
import { switchTheme } from '@/services/public/utils/themes'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { debounce } from 'lodash'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Nav() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [statusMenu, setStatusMenu] = useState('close')
  const { isAuthContext, setIsAuthContext } = useIsAuthContext()
  const { isAdminAuthenticated, isAuthenticated } = isAuthContext

  const navRef = useRef(null)
  const menuBackgroundRef = useRef(null)
  const menuContainerRef = useRef(null)
  const menuAvailable = statusMenu !== 'unavailable'

  const switchMenu = turnOff => {
    let newStatus
    if (turnOff === true) newStatus = 'unavailable'
    else if (statusMenu === 'open') newStatus = 'close'
    else if (statusMenu === 'close') newStatus = 'open'
    setStatusMenu('running')

    const background = menuBackgroundRef.current
    const menu = menuContainerRef.current

    let toggle
    if (newStatus === 'open') {
      document.body.classList.add('no-scroll')
      toggle = 0
    } else {
      document.body.classList.remove('no-scroll')
      toggle = 1
    }

    const transitions = [
      {
        element: background,
        properties: { opacity: [1, 0] },
        display: { action: !toggle ? 'show' : 'hidde' }
      },
      {
        element: menu,
        properties: {
          transform: ['translateX(0)', 'translateX(100vw)']
        }
      }
    ]

    runTransition(transitions, toggle).then(() => setStatusMenu(newStatus))
  }

  const logout = async () => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    const url = `${backend}/api/auth/logout`
    const req = await fetch(url, { credentials: 'include' })
    const res = await req.json()

    if (res.error) return jtoast(res.error)
    const { authData } = res
    const { rol, isAuthenticated } = authData
    const expires = 365 * 100

    Cookies.set('auth', `${rol}-${isAuthenticated}`, {
      sameSite: 'strict',
      expires
    })

    setIsAuthContext(res.authData)
    jtoast(res.message)
    return Router.push('/login')
  }

  const handleWindowResize = debounce(() => {
    setWindowWidth(window.innerWidth)
  }, 100)

  useEffect(() => {
    globalThis.navMainHTML = navRef.current
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
  const menuContainerClassName = () => {
    const onMenuAvailable = 'pf tp0 lf0 w100p h100p owxA menuContainer'
    return `df gpM lsN ${menuAvailable ? onMenuAvailable : ''}`
  }

  const divMenuContainerClassName = () => {
    const onMenuAvailable = 'w100p h100p df jcfe minWD'
    return `df gpM lsN ${menuAvailable ? onMenuAvailable : ''}`
  }

  const menuClassName = () => {
    const onMenuAvailable = 'fdc h100p tp0 rt0 bcBgp owA crL menu'
    return `df gpM lsN ${menuAvailable ? onMenuAvailable : ''}`
  }

  const hrefUser = () => {
    if (isAdminAuthenticated) return '/admin/inventario'
    else if (isAuthenticated) return '/'
    else return '/login'
  }

  // Component required
  function NavOption({ href, icon, isButton, run }) {
    let classNames = 'df jcc aic cp'
    const optionStyles = { fontSize: '1.5rem' }
    if (menuAvailable) {
      classNames += ' bcBgs'
      optionStyles.height = '50px'
    }

    return (
      <li>
        {!isButton ? (
          <Link href={href || null} className={classNames} style={optionStyles}>
            <FontAwesomeIcon icon={icon} />
          </Link>
        ) : (
          <div className={classNames} style={optionStyles} onClick={run}>
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
      </li>
    )
  }

  NavOption.propTypes = {
    href: PropTypes.string,
    icon: PropTypes.object.isRequired,
    isButton: PropTypes.bool,
    run: PropTypes.func
  }

  return (
    <nav ref={navRef} className='pf w100p df aic jcsb bcDp pgM'>
      <section
        className='bcP pgyML pgxL brM'
        style={{ fontSize: '1.7rem', padding: 'var(--remM) var(--remL)' }}
      >
        <Link href='/' className='df aic cp gpM'>
          <Image
            src='/tienda.png'
            width={50}
            height={50}
            alt='tienda del barrio la veci'
          />
          <span className='fwB fsI'>LA VECI</span>
        </Link>
      </section>
      {menuAvailable ? (
        <section>
          <button
            className='cp bcT pgM crS'
            style={{ fontSize: '2rem' }}
            onClick={switchMenu}
          >
            <FontAwesomeIcon icon={solid('bars')} />
          </button>
        </section>
      ) : null}
      <section className={menuAvailable ? 'pf' : null}>
        {menuAvailable ? (
          <article
            ref={menuBackgroundRef}
            className='dn pf w100p h100p tp0 lf0 menuBackground'
          />
        ) : null}
        <article
          ref={menuContainerRef}
          className={menuContainerClassName()}
          style={{ transform: !menuAvailable ? 'translateX(0)' : null }}
        >
          <div className={divMenuContainerClassName()}>
            {menuAvailable ? (
              <section>
                <button
                  className='pa w100p h100p tp0 lf0 bcT'
                  onClick={statusMenu !== 'running' ? switchMenu : null}
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
                        : null
                    }
                  >
                    <FontAwesomeIcon icon={solid('bars')} />
                  </button>
                </li>
              ) : null}
              <NavOption href='/' icon={solid('house')} />
              <NavOption href='/productos' icon={solid('basket-shopping')} />
              <NavOption href='/carrito' icon={solid('cart-shopping')} />
              <NavOption href={hrefUser()} icon={solid('circle-user')} />
              {isAdminAuthenticated ? (
                <NavOption href='/admin/inventario' icon={solid('boxes')} />
              ) : null}
              {isAuthenticated ? (
                <NavOption
                  icon={solid('arrow-right-from-bracket')}
                  isButton={true}
                  run={logout}
                />
              ) : null}
              <NavOption
                icon={solid('star-half-stroke')}
                isButton={true}
                run={switchTheme}
              />
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
