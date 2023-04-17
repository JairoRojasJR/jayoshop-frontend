import PropTypes from 'prop-types'
import Router from 'next/router'
import Head from 'next/head'
import { useIsAuthContext } from '@/context/isAuth'
import Layout from '@/components/global/Layout'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

function SectionForm({ label, name, type, placeholder }) {
  return (
    <section key={nanoid(5)} className='w100p df fdc gpM'>
      <label className='cp pgS bcDs brM' htmlFor='username'>
        {label}
      </label>
      <input
        className='pgM brM'
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </section>
  )
}

SectionForm.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string.isRequired
}

export default function Login() {
  const { isAuthContext, setIsAuthContext } = useIsAuthContext()
  const { isAdminAuthenticated, isAuthenticated } = isAuthContext
  const redirecting = isAdminAuthenticated || isAuthenticated

  const login = async e => {
    e.preventDefault()
    const url = `${globalThis.backendUrl}/api/auth/login`
    const form = e.target
    const formData = Object.fromEntries(new FormData(form))

    const req = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    const res = await req.json()
    if (res.error) return jtoast(res.error)

    const { authData } = res
    const { rol, isAuthenticated } = authData
    const expires = 365 * 100

    Cookies.set('auth', `${rol}-${isAuthenticated}`, {
      sameSite: 'strict',
      expires
    })

    setIsAuthContext(authData)
    jtoast(res.message)
  }

  useEffect(() => {
    if (isAdminAuthenticated) Router.push('/admin/inventario')
    else if (isAuthenticated) Router.push('/')
  }, [isAuthContext])

  return (
    <>
      <Head>
        <title>Login - La Veci</title>
      </Head>
      <Layout>
        {isAuthContext && !redirecting ? (
          <>
            <div className='df fdc gpLX pgLX'>
              <h1>Login</h1>
              <form className='df fdc aic pgL brM gpL bcS crP' onSubmit={login}>
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
                box-shadow: -0.1rem -0.1rem 0.1rem var(--sky-violet),
                  0.1rem 0.1rem 0.1rem var(--sky-blue);
              }

              input[type='submit']:hover {
                box-shadow: -0.2rem -0.2rem 0.2rem var(--sky-violet),
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

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie
  const auth = cookies
    .split('; ')
    .find(row => row.startsWith('auth'))
    .split('=')[1]

  if (auth === 'admin-true') {
    context.res.writeHead(302, { Location: '/admin/inventario' })
    context.res.end()
  } else if (auth === 'client-true') {
    if (auth === 'admin-true') {
      context.res.writeHead(302, { Location: '/' })
      context.res.end()
    }
  }

  return {
    props: {
      isAuthenticated: false
    }
  }
}
