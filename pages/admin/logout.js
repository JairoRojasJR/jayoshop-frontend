import { useIsAuthContext } from '@/context/isAuth';
import Router from 'next/router';
import { useEffect } from 'react';

export default function Logout() {
  const { isAuthContext, setIsAuthContext } = useIsAuthContext();
  
  useEffect(() => {
    if (isAuthContext.authenticated) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/admin/logout`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            const authData = { ...isAuthContext };
            authData.authenticated = false;
            document.cookie = 'isauth=true; max-age=0; path=/; samesite=strict;'
            setIsAuthContext(authData);
          }
        });
    }
  }, [isAuthContext]);
  
  useEffect(() => {
    Router.push('/admin/login');
  },[])
}
