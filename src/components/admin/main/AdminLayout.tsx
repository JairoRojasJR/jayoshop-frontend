import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { runTransition } from '@/services/public/utils/transition'
import { nanoid } from 'nanoid'
import ArrowUp from '@/svg/Arrow-up'
import styles from '@/styles/AdminLayout.module.css'
import type { Toggle, Transitions } from '@/types'

type Props = {
  children: React.ReactNode
  plusIn?: React.ReactNode
  plusOut?: React.ReactNode
  onChangeSubNavTop?: (newTopHeader: number, headerClientHeight: number) => void
}

export default function AdminLayout({
  children,
  plusIn,
  plusOut,
  onChangeSubNavTop
}: Props): JSX.Element {
  const [initialHeightHeader, setInitialHeightHeader] = useState(0)
  const [initialTopHeader, setInitialTopHeader] = useState(0)
  const [statusAdminNav, setStatusAdminNav] = useState('open')
  const [currentAdminPage, setCurrentAdminPage] = useState('')

  type Ref = React.MutableRefObject<HTMLElement | null>
  type AdminNavRef = React.MutableRefObject<HTMLButtonElement | null>

  const router = useRouter()
  const headerAdminRef: Ref = useRef(null)
  const mainRef: Ref = useRef(null)
  const adminNavRef: AdminNavRef = useRef(null)
  const switchAdminNavRef: AdminNavRef = useRef(null)
  const pages = ['inventario', 'vender']

  const repositionElements = (toggle: Toggle): void => {
    const navHTML = globalThis.navMainHTML
    const headerHTML = headerAdminRef.current
    const adminNavHTML = adminNavRef.current
    const mainHTML = mainRef.current

    if (headerHTML === null) throw new Error('No se puedo obtener el header')
    if (adminNavHTML === null) throw new Error('No se puedo obtener el nav')
    if (mainHTML === null) throw new Error('No se puedo obtener el main')

    let newMarginTopMain = 0
    let newTopHeader = 0
    if (toggle === 0) {
      newTopHeader = navHTML.clientHeight
      newMarginTopMain = initialHeightHeader ?? headerHTML.clientHeight
    } else if (toggle === 1) {
      const headerElements = headerHTML.children[0]
      const expandable = headerElements.children[0]
      newTopHeader = headerHTML.offsetTop - adminNavHTML.clientHeight
      newMarginTopMain = headerHTML.clientHeight - expandable.clientHeight
    }

    headerHTML.style.top = `${newTopHeader}px`
    mainHTML.style.marginTop = `${newMarginTopMain}px`
    if (onChangeSubNavTop !== undefined) {
      onChangeSubNavTop(newTopHeader, headerHTML.clientHeight)
    }
  }

  const switchAdminNav = (): void => {
    const closing = statusAdminNav === 'open'
    const toggle = closing ? 1 : 0
    const newStatus = closing ? 'close' : 'open'
    const switchAdminNavHTML = switchAdminNavRef.current
    const noSwitch = switchAdminNavHTML === null

    if (noSwitch) throw new Error('No se encontró el elemento switch')

    const transitions: Transitions = [
      {
        element: switchAdminNavHTML,
        properties: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(180deg)' }
        }
      }
    ]

    runTransition(transitions, toggle).catch((e: Error) => {
      console.log(e)
    })
    repositionElements(toggle)
    setStatusAdminNav(newStatus)
  }

  useEffect(() => {
    if (headerAdminRef?.current !== null) {
      setInitialHeightHeader(headerAdminRef.current.clientHeight)
      setInitialTopHeader(headerAdminRef.current.offsetTop)
      repositionElements(0)
    }
  }, [])

  useEffect(() => {
    const headerHTML = headerAdminRef.current
    const mainHTML = mainRef.current

    if (headerHTML !== null && mainHTML !== null) {
      mainHTML.style.marginTop = `${headerHTML.clientHeight}px`
    }
  }, [initialTopHeader])

  useEffect(() => {
    const routeSplit = router.route.split('/')
    const currentPage = routeSplit[routeSplit.length - 1]
    setCurrentAdminPage(currentPage)
  }, [router])

  return (
    <>
      <header
        ref={headerAdminRef}
        className={`${styles.adminHeader} w100p pf lf0 df fdc`}
      >
        <div className='pr'>
          <section
            ref={adminNavRef}
            className={`${styles.adminNav} df fdc aic pgM pr bcP gpL`}
          >
            <nav className='w100p bcP'>
              <ul className='df jcc gpL lsn'>
                {pages.map(page => {
                  let className = `${styles.linkPage} brS pgM tac cp bcD crL`
                  const isCurrentPage = currentAdminPage === page
                  if (isCurrentPage) className += ` ${styles.linkPageSelected}`

                  return (
                    <li key={nanoid(10)} className='df'>
                      <Link href={`/admin/${page}`} className={className}>
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            {plusIn}
            <button
              ref={switchAdminNavRef}
              className={`${styles.switchAdminNav} df aic jcc pa cp`}
              style={{
                border: 'var(--remS) solid var(--darksecondary)',
                background: 'var(--darkprimary)'
              }}
              onClick={() => {
                switchAdminNav()
              }}
            >
              <ArrowUp stroke='var(--darksecondary)' />
            </button>
          </section>
          <section>{plusOut}</section>
        </div>
      </header>
      <main
        ref={mainRef}
        className='pgLX df fdc gpLX'
        style={{ transition: 'margin var(--timeFlash)' }}
      >
        {children}
      </main>
    </>
  )
}
