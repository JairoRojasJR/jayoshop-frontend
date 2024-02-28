import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(): React.ReactElement {
  return (
    <Html lang='es' className='dark'>
      {/* <Html lang='es'> */}
      <Head />
      <body className='bg-light-100 dark:bg-dark-100'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
