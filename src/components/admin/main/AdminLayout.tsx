'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { runTransition } from '@/services/public/utils/transition'
import { nanoid } from 'nanoid'
import ArrowUp from '@/svg/Arrow-up'
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

  const pathname = usePathname()
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
    const routeSplit = pathname.split('/')
    const currentPage = routeSplit[routeSplit.length - 1]
    setCurrentAdminPage(currentPage)
  }, [pathname])

  return (
    <>
      <header
        ref={headerAdminRef}
        className='fixed left-0 z-[900] flex w-full min-w-[350px] flex-col px-8 transition-all duration-300'
      >
        <div className='relative m-auto w-full max-w-[600px]'>
          <section
            ref={adminNavRef}
            className='relative flex flex-col items-center rounded-b-none border-4 border-t-0 border-solid border-dark-300 bg-light-200 dark:bg-dark-200'
          >
            <nav className='w-full p-2'>
              <ul className='flex list-none justify-center gap-4'>
                {pages.map(page => {
                  let className = `rounded-md p-2 text-center cursor-pointer transition duration-300`
                  const isCurrentPage = currentAdminPage === page
                  if (isCurrentPage) {
                    className += ` bg-gradient-to-r from-skyviolet to-skyblue text-dark-200`
                  } else {
                    className +=
                      ' bg-dark-100 text-light-200 hover:bg-skyviolet transition duration-300 hover:scale-105'
                  }

                  return (
                    <li key={nanoid(10)} className='flex'>
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
              className='absolute -bottom-5 -right-5 flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-solid border-dark-300 bg-light-100 text-sm transition duration-300 dark:bg-dark-100'
              onClick={() => {
                switchAdminNav()
              }}
            >
              <ArrowUp className='stroke-dark-200 stroke-[4] dark:stroke-light-200' />
            </button>
          </section>
          <section>{plusOut}</section>
        </div>
      </header>
      <section
        ref={mainRef}
        className='flex flex-col gap-8 p-8 transition-all duration-300'
      >
        {children}
      </section>
    </>
  )
}
