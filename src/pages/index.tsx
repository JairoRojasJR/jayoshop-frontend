import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useIsAuthContext } from '@/context/isAuth'
import Layout from '@/components/global/Layout'
import SectionCard from '@/components/utils/CardSection'
import {
  getSections,
  getMostPopularsProducts
} from '@/services/public/inventory'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'
import styles from '@/styles/Home.module.css'
import type { Products, Sections } from '@/types'
import BuildingStore from '@/svg/BuildingStore'

export default function Home(): JSX.Element {
  const { isAuthContext } = useIsAuthContext()
  const [vh, setVh] = useState(0)
  const [heightNav, setHeightNav] = useState(0)
  const [mostPopulars, setMostPopulars] = useState<Products>([])
  const [sections, setSections] = useState<Sections>([])

  const runNotificationOnError = (error: Error, target: string): void => {
    const msg = `No se pudo obtener ${target}, error en el servidor: ${error.message}`
    jtoast(msg, { duration: 8000 })
  }

  let finished = false

  useEffect(() => {
    if (!finished) {
      const navHTML = globalThis.navMainHTML
      setHeightNav(navHTML.clientHeight)
      setVh(window.innerHeight)
      finished = true
    }
  }, [])

  useEffect(() => {
    getMostPopularsProducts()
      .then(products => {
        setMostPopulars(products)
      })
      .catch(error => {
        runNotificationOnError(error, 'los productos')
      })
    getSections()
      .then(sections => {
        setSections(sections)
      })
      .catch(error => {
        runNotificationOnError(error, 'las secciones')
      })
  }, [isAuthContext])

  return (
    <>
      <Head>
        <title>JayoShop</title>
        <meta
          name='description'
          content='Tienda del barrio, todo lo que puedas necesitar en la tienda del barrio Machala'
        />
      </Head>
      <Layout>
        <header style={{ height: `${vh - heightNav}px` }}>
          <div className='df fdc h100p pgLX pr'>
            <section
              style={{
                paddingRight: 'var(--remX)'
              }}
            >
              <h1 style={{ fontSize: '2.5rem' }}>
                Tienda del barrio{' '}
                <span className={`${styles.title} tsCF`}>JayoShop</span>
              </h1>
            </section>
            <section className='pr fg1'>
              <article className={`${styles.coverContainer} pa tp0`}>
                <div className={`${styles.coverDiv} pa h100p`}>
                  <BuildingStore
                    stroke='var(--darksecondary)'
                    className='pa h100p'
                    style={{
                      left: '-30vw',
                      filter: 'drop-shadow(0 0 5px var(--sky-blue))'
                    }}
                  />
                  <Image
                    className={`${styles.coverCEO} ofCn`}
                    alt='empresaria'
                    src='/businessmen.png'
                    fill
                    sizes='
                      (max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw
                    '
                  />
                </div>
              </article>
            </section>
            <section className='pr lf0 bm0'>
              <article
                className='pa bm0'
                style={{ paddingRight: 'var(--remX)', zIndex: '150' }}
              >
                <p
                  className={`${styles.coverDesc} bcDp crDs pgL brM`}
                  style={{
                    background: 'var(--primary-trans)',
                    backdropFilter: 'blur(.5rem)'
                  }}
                >
                  Todos los productos que necesitas y/o deseas aqui en JayoShop
                </p>
                <Link href='/productos'>
                  <button className={`${styles.coverCta} pgL brM crD cp fwB`}>
                    EMPEZAR A COMPRAR
                  </button>
                </Link>
              </article>
            </section>
          </div>
        </header>
        <main className='df fdc gpLX pgLX'>
          <section>
            <div className='pr df jcc'>
              <Image
                className='brM'
                alt='estanteria de productos'
                src='/estanteria-de-productos.png'
                width={200}
                height={200}
              />
              <h3
                className='pa crDp rounded-sm p-1'
                style={{
                  top: '90%',
                  left: '30%',
                  background: 'var(--secondary-trans)',
                  backdropFilter: '.8rem'
                }}
              >
                Tu portal a cientos de productos
              </h3>
            </div>
            <p style={{ marginTop: 'var(--remX)' }}>
              Acceda a toda amplia variedad de productos de todo tipo, productos
              relacionados a la alimentacion (...), la higiene, la limpieza, los
              electrodomesticos, muchas variedades de golosinas, entre muchos
              otros.
            </p>
          </section>
          <section>
            <h3 className='tac'>Más populares</h3>
            <div className={`${styles.mpContainer} dg gpL jcc`}>
              {mostPopulars.map(product => {
                const { name, image } = product
                const urlImage = `${globalThis.backendUrl}/api/stream/image/${image}`

                return (
                  <article
                    key={nanoid(5)}
                    className={`${styles.mpCard} df fdc aic gpM`}
                  >
                    <div
                      className={`${styles.mpImgContainer} w100p pr brM owH`}
                    >
                      <Image
                        className='ofCr'
                        alt={name}
                        src={urlImage}
                        loader={data => `${urlImage}?width=${data.width}`}
                        fill
                        sizes={`
                          (max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw
                        `}
                      />
                    </div>
                    <span
                      className={`${styles.mpProductName} w100p pgS tac toe wsNW owH`}
                    >
                      {product.name}
                    </span>
                    <button className={`${styles.mpBtnCTA} brS crP bcS cp`}>
                      COMPRAR
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
          <section>
            <h3 className='tac'>Secciones</h3>
            <div className='df fdc gpL'>
              {sections.map(section => (
                <SectionCard key={nanoid(5)} data={section} />
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </>
  )
}
