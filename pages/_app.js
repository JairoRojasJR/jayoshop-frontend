import { IsAuthContextProvider } from '@/context/isAuth';
import '@/styles/globals.css';
import '../styles/normalize.css';

export default function App({ Component, pageProps }) {
  return (
    <IsAuthContextProvider>
      <Component {...pageProps} />
    </IsAuthContextProvider>
  );
}
