'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const IsAuthContext = createContext();

export function IsAuthContextProvider({ children }) {
  const [isAuthContext, setIsAuthContext] = useState(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/admin/login`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(res => {
        if (!res.authenticated) {
          document.cookie = 'isauth=false; max-age=0; path=/; samesite=strict;';
        }
        else if(res.authenticated) {
          document.cookie = 'isauth=true; path=/; samesite=strict;';
        }
        return setIsAuthContext(res);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <IsAuthContext.Provider value={{ isAuthContext, setIsAuthContext }}>
      {children}
    </IsAuthContext.Provider>
  );
}

export function useIsAuthContext() {
  return useContext(IsAuthContext);
}
