import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

// Components
import Layout from '../components/Layout';
import Presentation from '../components/Presentation';
import Portal from '../components/home/Portal';
import Mostpopular from '../components/home/Mostpopular';
import Categories from '../components/home/Categories';
import Ubication from '../components/home/Ubication';

export default function Home() {
  const [vh, setVh] = useState('100vh');

  useEffect(() => {
    setVh(window.innerHeight);
  }, []);

  return (
    <>
      <Head>
        <title>Tienda del Barrio La veci</title>
        <meta
          name="description"
          content="Tienda del barrio, todo lo que puedas necesitar en la tienda del barrio San Francisco Machala"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <header className="df fdc pr" style={{ height: vh, top: '-5rem' }}>
          <Presentation styles={styles} />
        </header>
        <main>
          <Portal />
          <Mostpopular styles={styles} />
          <Categories styles={styles} />
          <Ubication />
        </main>
      </Layout>
    </>
  );
}