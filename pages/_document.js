import { Html, Head, Main, NextScript } from 'next/document';
import { JToast } from '@/components/jtoast';

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        <JToast></JToast>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
