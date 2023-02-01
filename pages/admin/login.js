import styles from '../../styles/admin/Login.module.css';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { useIsAuthContext } from '@/context/isAuth';

export default function Admin() {
  const { isAuthContext, setIsAuthContext } = useIsAuthContext();
  
  const sendAdminCredentials = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = Object.fromEntries(new FormData(form));

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/admin/login`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await req.json();
    console.log('--- Login data ---');
    console.log(data);

    if (data.success) {
      const authData = { ...isAuthContext };
      authData.authenticated = true;
      setIsAuthContext(authData);
      document.cookie = 'isauth=true; max-age=null; path=/;'
      return Router.push('/admin/inventario');
    }
    console.log(data.msg);
  };

  return (
    <>
      <Layout>
        <div className={`${styles.container} df fdc`}>
          <h1>Administración - Login</h1>
          <p>
            Bienvenido/a señor/a admin, por favor ingrese su usuario y
            contraseña para acceder a las funciones de administración.
            <br />
            Si no recuerda la contraseña, póngase en contacto con su
            desarrollar.
          </p>
          <form
            className={`${styles.form} df fdc`}
            onSubmit={sendAdminCredentials}
          >
            <label className={'cp'} htmlFor={'pass'}>
              Ingresar usuario
            </label>
            <input
              id="username"
              className={styles.in}
              type={'text'}
              placeholder="Usuario"
              name="username"
              defaultValue={'laveci'}
            />
            <label className={'cp'} htmlFor={'pass'}>
              Ingresar contraseña
            </label>
            <input
              id="password"
              className={styles.in}
              type={'password'}
              placeholder="Contraseña"
              name="password"
              defaultValue={'12345'}
            />
            <input
              className={`${styles.send} cp`}
              type={'submit'}
              value={'Entrar'}
            />
          </form>
        </div>
      </Layout>
    </>
  );
}
