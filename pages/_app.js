import PropTypes from 'prop-types'
import { IsAuthContextProvider } from '@/context/isAuth'
import Modal from '@/components/global/Modal'
import JToast from '@/packages/jtoast/Jtoast'
import '@/styles/globals.css'
import '@/styles/normalize.css'

globalThis.isProdMode = process.env.NEXT_PUBLIC_MODE === 'prod'
globalThis.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function App({ Component, pageProps }) {
  return (
    <IsAuthContextProvider>
      <JToast />
      <Modal />
      <Component {...pageProps} />
    </IsAuthContextProvider>
  )
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
}
