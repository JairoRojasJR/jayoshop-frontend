'use client'

import { useAuthContext } from '@/context/Auth'
import { CustomForm, Field } from '@/components/CustomForm'

export default function FormLogin(): JSX.Element {
  const { login } = useAuthContext()

  return (
    <CustomForm title='Credenciales' goal='Entrar' onSubmit={login}>
      <Field
        label='Usuario'
        name='username'
        placeholder='Introduzca su usuario'
      />
      <Field
        label='Contraseña'
        name='password'
        type='password'
        placeholder='Introduzca su contraseña'
      />
    </CustomForm>
  )
}
