'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/global/Nav'
import { getThemeSaved } from '@/services/public/utils/themes'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props): JSX.Element {
  const [vh, setVh] = useState('0px')
  const [heightNav, setHeightNav] = useState('0px')

  useEffect(() => {
    const navHTML = globalThis.navMainHTML
    setVh(`${window.innerHeight}px`)
    setHeightNav(`${navHTML.clientHeight}px`)
    getThemeSaved()

    const bodyClassnames = document.body.classList
    const isBodyNoScroll = bodyClassnames.contains('no-scroll')
    if (isBodyNoScroll) bodyClassnames.remove('no-scroll')
  }, [])

  return (
    <>
      <div className='flex flex-col justify-between' style={{ minHeight: vh }}>
        <Nav />
        <main style={{ marginTop: heightNav, flexGrow: 1 }}>{children}</main>
        <footer className='flex flex-wrap gap-12 bg-light-200 p-8 text-dark-100 transition duration-300 dark:bg-dark-200 dark:text-light-100'>
          <section className='flex flex-col gap-2'>
            <h5 className='font-bold italic text-skyviolet dark:text-skyblue'>
              Nosotros
            </h5>
            <Link href='/about'>Acerca de</Link>
          </section>
          <section className='flex flex-col gap-2'>
            <h5 className='font-bold italic text-skyviolet dark:text-skyblue'>
              Desarrollador de este sitio
            </h5>
            <Link href='https://www.jayoweb.dev' target='_blank'>
              Visitar sitio web
            </Link>
          </section>
        </footer>
      </div>
    </>
  )
}
