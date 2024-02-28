import { IsAuthContextProvider } from '@/context/isAuth'
import Modal from '@/components/global/Modal'
import JToast from '@/packages/jtoast/Jtoast'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

globalThis.isProdMode = process.env.NEXT_PUBLIC_MODE === 'prod'
globalThis.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
globalThis.streamImage = `${globalThis.backendUrl}/api/stream/image`

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <IsAuthContextProvider>
      <JToast />
      <Modal />
      <Component {...pageProps} />
    </IsAuthContextProvider>
  )
}
