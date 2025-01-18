import { type Metadata } from 'next'
import FormLogin from '@/components/FormLogin'
import style from '@/css/ShortStyles.module.css'

export const metadata: Metadata = { title: 'Iniciar sesión - JayoShop' }

export default async function Login(): Promise<JSX.Element> {
  return (
    <div className={'login ' + style.login__container}>
      <h1>Login</h1>
      <FormLogin />
    </div>
  )
}
