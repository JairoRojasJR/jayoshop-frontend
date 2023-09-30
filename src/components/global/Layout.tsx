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
      <div className='df fdc jcsb' style={{ minHeight: vh }}>
        <Nav />
        <main style={{ marginTop: heightNav, flexGrow: 1 }}>{children}</main>
        <footer className='df jcse fwW pgL crL bcBgs'>
          <section className='df fdc gpM'>
            <h5 className='fsI'>Nosotros</h5>
            <Link href='./acerca-de'>Acerca de</Link>
          </section>
          <section className='df fdc gpM'>
            <h5 className='fsI'>Desarrollador de este sitio</h5>
            <Link href='./desarrollador-web'>Acerca de</Link>
            <Link href='https://www.jayoweb.com'>Sitio web</Link>
          </section>
        </footer>
      </div>
    </>
  )
}
