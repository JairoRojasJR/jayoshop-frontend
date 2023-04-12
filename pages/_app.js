import PropTypes from 'prop-types'
import { IsAuthContextProvider } from '@/context/isAuth'
import Modal from '@/components/global/Modal'
import JToast from '@/packages/jtoast/Jtoast'
import '@/styles/globals.css'
import '@/styles/normalize.css'

export default function App({ Component, pageProps }) {
  globalThis.mode = process.env.NEXT_PUBLIC_MODE
  globalThis.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

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
