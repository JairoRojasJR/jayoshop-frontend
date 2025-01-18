import Link from 'next/link'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import AuthProvider from '@/context/Auth'
import ModalProvider from '@/context/Modal'
import Nav from '@/components/Nav'
import JToast from '@/packages/jtoast/Jtoast'
import { getAuth } from '@/services/auth'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'JayoShop',
  description: 'Todos los productos que necesitas en tu tienda online Jayoshop'
}

type Props = Readonly<{ children: React.ReactNode }>

export default async function RootLayout({
  children
}: Props): Promise<JSX.Element> {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value
  const { rol, isAuthenticated } = await getAuth(cookieStore.toString())

  return (
    <html lang='es' className={theme !== 'dark' ? theme : undefined}>
      <AuthProvider initial={{ rol, authenticated: isAuthenticated }}>
        <body>
          <ModalProvider>
            <JToast />
            <Nav />
            <main style={{ flexGrow: 1 }}>{children}</main>
          </ModalProvider>
          <footer>
            <Link href='/about'>Sobre nosotros</Link>
            <Link href='https://www.jayoweb.dev' target='_blank'>
              Desarrollador de este sitio
            </Link>
          </footer>
        </body>
      </AuthProvider>
    </html>
  )
}
