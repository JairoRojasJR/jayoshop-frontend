import Layout from '@/components/Layout';
import Router from 'next/router';
import { useIsAuthContext } from '@/context/isAuth';
import { useEffect } from 'react';

export default function Preprod() {
  const isInPreProd = process.env.NEXT_PUBLIC_PRE_PROD === 'true';
  const { isAuthContext } = useIsAuthContext();

  useEffect(() => {
    if (!isInPreProd) Router.push('/');
  }, []);

  return (
    <Layout>
      {isInPreProd ? (
        <section>
          {isAuthContext !== false ? JSON.stringify(isAuthContext) : ''}
        </section>
      ) : (
        ''
      )}
    </Layout>
  );
}
