import Router from 'next/router'
import Head from 'next/head'
import { useEffect } from 'react'
import { useIsAuthContext } from '@/context/isAuth'
import Layout from '@/components/global/Layout'
import { login } from '@/services/public/auth'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'
import { type GetServerSidePropsContext } from 'next'
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
    <section key={nanoid(5)} className='w100p df fdc gpM'>
      <label className='cp pgS bcDs crDp brM' htmlFor='username'>
        {label}
      </label>
      <input
        className='pgM brM crD'
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
    if (isAdminAuthenticated) {
      Router.push('/admin/inventario').catch((e: Error) => {
        console.log(e.message)
      })
    } else if (isAuthenticated) {
      Router.push('/').catch((e: Error) => {
        console.log(e.message)
      })
    }
  }, [isAuthContext])

  return (
    <>
      <Head>
        <title>Login - JayoShop</title>
      </Head>
      <Layout>
        {isAuthContext.serverStatus !== 'connecting' && !redirecting ? (
          <>
            <div className='df fdc gpLX pgLX'>
              <h1>Login</h1>
              <form
                className='df fdc aic pgL brM gpL bcS'
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
                  className='brS bcDp crDs cp'
                  style={{ padding: 'var(--remM) var(--remL)' }}
                  type='submit'
                  value='Entrar'
                />
              </form>
            </div>
            <style jsx>{`
              input:focus {
                outline: var(--remS) solid var(--darkprimary);
              }

              input[type='submit'] {
                transition: box-shadow var(--timeFlash);
                box-shadow:
                  -0.1rem -0.1rem 0.1rem var(--sky-violet),
                  0.1rem 0.1rem 0.1rem var(--sky-blue);
              }

              input[type='submit']:hover {
                box-shadow:
                  -0.2rem -0.2rem 0.2rem var(--sky-violet),
                  0.2rem 0.2rem 0.2rem var(--sky-blue);
              }
            `}</style>
          </>
        ) : (
          <></>
        )}
      </Layout>
    </>
  )
}

type ServerSideProps = {
  props: { isAuthenticated: boolean }
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<ServerSideProps> {
  const cookies = context.req.headers.cookie
  const auth = cookies
    ?.split('; ')
    ?.find(row => row.startsWith('auth'))
    ?.split('=')[1]

  if (auth === 'admin-true') {
    context.res.writeHead(302, { Location: '/admin/inventario' })
    context.res.end()
  } else if (auth === 'client-true') {
    context.res.writeHead(302, { Location: '/' })
    context.res.end()
  }

  return {
    props: {
      isAuthenticated: false
    }
  }
}
