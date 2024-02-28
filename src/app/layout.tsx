import { type Metadata } from 'next'
import './globals.css'

import { IsAuthContextProvider } from '@/context/isAuth'
import Modal from '@/components/global/Modal'
import JToast from '@/packages/jtoast/Jtoast'

export const metadata: Metadata = {
  title: 'Tienda del barrio JayoShop'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html lang='es' className='dark'>
      <body className='bg-light-100 dark:bg-dark-100'>
        <IsAuthContextProvider>
          <JToast />
          <Modal />
          <main>{children}</main>
        </IsAuthContextProvider>
      </body>
    </html>
  )
}
