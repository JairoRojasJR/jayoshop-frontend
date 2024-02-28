'use client'

import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { useEffect } from 'react'
import { useIsAuthContext } from '@/context/isAuth'
import Layout from '@/components/global/Layout'
import { login } from '@/services/public/auth'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'
// import { type GetServerSidePropsContext } from 'next'
import type { Login as TypeLogin } from '@/types'

type PropsSectionForm = {
  label: string
  name: string
  type?: string
  placeholder: string
}

function SectionForm({
  label,
  name,
  type,
  placeholder
}: PropsSectionForm): JSX.Element {
  return (
    <section key={nanoid(5)} className='flex w-full flex-col gap-2'>
      <label
        className='cursor-pointer rounded-lg p-1 text-light-200 dark:text-dark-200'
        htmlFor='username'
      >
        {label}
      </label>
      <input
        className='rounded-lg p-2 text-dark-100 focus:shadow-skyviolet focus:outline-none'
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </section>
  )
}

export default function Login(): JSX.Element {
  const { isAuthContext, setIsAuthContext } = useIsAuthContext()
  const { isAdminAuthenticated, isAuthenticated } = isAuthContext
  const redirecting = isAdminAuthenticated || isAuthenticated

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = Object.fromEntries(new FormData(form)) as TypeLogin

    const runLogin = async (): Promise<void> => {
      const authData = await login(formData)
      authData.serverStatus = 'connected'
      setIsAuthContext(authData)
    }

    jtoast('Iniciando sesión', {
      onAsyncEvents: {
        isAsync: true,
        callback: runLogin,
        onSuccess: 'Sesión iniciada',
        handleError: () => 'Ocurrió un error al iniciar sesión'
      }
    })
  }

  useEffect(() => {
    if (isAdminAuthenticated) router.push('/admin/inventario')
    else if (isAuthenticated) router.push('/')
  }, [isAuthContext])

  return (
    <>
      <Head>
        <title>Login - JayoShop</title>
      </Head>
      <Layout>
        {isAuthContext.serverStatus !== 'connecting' && !redirecting ? (
          <>
            <div className='flex flex-col gap-8 p-8'>
              <h1 className='mx-auto text-3xl uppercase drop-shadow-skyblue'>
                Login
              </h1>
              <form
                className='mx-auto flex w-full max-w-[500px] flex-col gap-4 rounded-lg bg-dark-100 p-4 dark:bg-light-100'
                onSubmit={handleSubmit}
              >
                <SectionForm
                  label='Usuario'
                  name='username'
                  placeholder='Introduzca su usuario'
                />
                <SectionForm
                  label='Contraseña'
                  name='password'
                  type='password'
                  placeholder='Introduzca su contraseña'
                />
                <input
                  className='cursor-pointer self-start rounded-md bg-light-200 px-16 py-2 text-dark-200 transition duration-300 ease-in-out hover:shadow-skyblue dark:bg-dark-200 dark:text-light-200'
                  type='submit'
                  value='Entrar'
                />
              </form>
            </div>
          </>
        ) : (
          <></>
        )}
      </Layout>
    </>
  )
}

// type ServerSideProps = {
//   props: { isAuthenticated: boolean }
// }

// export async function getServerSideProps(
//   context: GetServerSidePropsContext
// ): Promise<ServerSideProps> {
//   const cookies = context.req.headers.cookie
//   const auth = cookies
//     ?.split('; ')
//     ?.find(row => row.startsWith('auth'))
//     ?.split('=')[1]

//   if (auth === 'admin-true') {
//     context.res.writeHead(302, { Location: '/admin/inventario' })
//     context.res.end()
//   } else if (auth === 'client-true') {
//     context.res.writeHead(302, { Location: '/' })
//     context.res.end()
//   }

//   return {
//     props: {
//       isAuthenticated: false
//     }
//   }
// }
