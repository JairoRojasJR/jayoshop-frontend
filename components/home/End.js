import Link from 'next/link';

export default function End() {
  return (
    <>
      <section>
        <h5>Nosotros</h5>
        <Link href={'./acerca-de'}>Acerca de</Link>
      </section>
      <section>
        <h5>Desarrollador de este sitio</h5>
        <Link href={'./desarrollador-web'}>Acerca de</Link>
        <Link href={'https://www.jayoweb.com'}>Sitio web</Link>
      </section>
    </>
  );
}
