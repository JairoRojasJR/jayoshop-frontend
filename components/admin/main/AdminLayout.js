import PropTypes from 'prop-types'
import { useState, createRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { runTransition } from '@/services/utils/transition'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import styles from '@/styles/AdminLayout.module.css'

export default function AdminLayout({ children, plusIn, plusOut }) {
  const [initialHeightHeader, setInitialHeightHeader] = useState(0)
  const [statusAdminNav, setStatusAdminNav] = useState('open')
  const [currentAdminPage, setCurrentAdminPage] = useState('')
  const router = useRouter()
  const headerAdminRef = createRef(null)
  const mainRef = createRef(null)
  const adminNavRef = createRef(null)
  const switchAdminNavRef = createRef(null)
  const pages = ['inventario', 'vender']

  const repositionElements = toggle => {
    const navHTML = globalThis.navMainHTML
    const headerHTML = headerAdminRef.current
    const adminNavHTML = adminNavRef.current
    const mainHTML = mainRef.current

    let newMarginTopMain
    let newTopHeader
    if (!toggle) {
      newTopHeader = navHTML.clientHeight
      newMarginTopMain = initialHeightHeader || headerHTML.clientHeight
    } else {
      const headerElements = headerHTML.children[0]
      const expandable = headerElements.children[0]
      newTopHeader = headerHTML.offsetTop - adminNavHTML.clientHeight
      newMarginTopMain = headerHTML.clientHeight - expandable.clientHeight
    }

    headerHTML.style.top = `${newTopHeader}px`
    mainHTML.style.marginTop = `${newMarginTopMain}px`
  }

  const switchAdminNav = () => {
    const closing = statusAdminNav === 'open'
    const toggle = closing ? 1 : 0
    const newStatus = closing ? 'close' : 'open'

    const transitions = [
      {
        element: switchAdminNavRef.current,
        properties: { transform: ['rotate(0deg)', 'rotate(180deg)'] }
      }
    ]

    runTransition(transitions, toggle)
    repositionElements(toggle)
    setStatusAdminNav(newStatus)
  }

  useEffect(() => {
    setInitialHeightHeader(headerAdminRef.current.clientHeight)
    repositionElements(0)
  }, [])

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
                    <li key={nanoid(10)} className={className}>
                      <Link href={`/admin/${page}`}>
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
              className={`${styles.switchAdminNav} pa cp`}
              style={{ border: 'var(--remS) solid var(--darksecondary)' }}
              onClick={() => switchAdminNav()}
            >
              <FontAwesomeIcon icon={solid('arrow-up')} />
            </button>
          </section>
          <section>{plusOut}</section>
        </div>
      </header>
      <main
        ref={mainRef}
        className='pgLX'
        style={{ transition: 'margin var(--timeFlash)' }}
      >
        {children}
      </main>
    </>
  )
}

AdminLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  plusIn: PropTypes.element,
  plusOut: PropTypes.element
}
