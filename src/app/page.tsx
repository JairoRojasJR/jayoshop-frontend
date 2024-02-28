'use client'

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
import type { Products, Sections } from '@/types'
import BuildingStore from '@/svg/BuildingStore'
import { BACKEND_URL } from './consts'

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
        runNotificationOnError(error as Error, 'los productos')
      })
    getSections()
      .then(sections => {
        setSections(sections)
      })
      .catch(error => {
        runNotificationOnError(error as Error, 'las secciones')
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
          <div className='relative flex h-full flex-col p-8'>
            <section className='pr-12'>
              <h1 className='text-4xl'>
                Tienda del barrio <span className='shadow-title'>JayoShop</span>
              </h1>
            </section>
            <section className='relative grow'>
              <article className='absolute top-0 size-full'>
                <div className='absolute size-full text-sm'>
                  <BuildingStore className='size-full stroke-dark-200 drop-shadow-skyblue dark:stroke-light-200' />
                  <Image
                    className='object-contain drop-shadow-skyviolet'
                    alt='empresario'
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
            <section className='relative bottom-0 left-0'>
              <article className='absolute bottom-0'>
                <p className='relative  z-20 overflow-hidden rounded-lg p-4  text-lg text-dark-200 backdrop-blur-sm dark:text-light-200'>
                  <span className='absolute left-0 top-0 size-full bg-light-200 opacity-95 dark:bg-dark-200' />
                  <span className='relative z-10'>
                    Todos los productos que necesitas y/o deseas aqui en
                    JayoShop
                  </span>
                </p>
                <Link
                  className='inline-block cursor-pointer rounded-lg bg-gradient-to-r from-skyviolet to-skyblue p-4 text-xl font-bold text-dark-200 drop-shadow-skyblue transition duration-300 hover:scale-105 hover:drop-shadow-skyviolet'
                  href='/productos'
                >
                  Empezar a comprar
                </Link>
              </article>
            </section>
          </div>
        </header>
        <main className='mt-16 flex flex-col gap-16 p-8 md:gap-32'>
          <section className='flex flex-col gap-16 sm:items-center'>
            <div className='relative flex justify-center'>
              <Image
                className='rounded-lg'
                alt='estanteria de productos'
                src='/estanteria-de-productos.png'
                width={200}
                height={200}
              />
              <div className='absolute left-[30%] top-[90%] overflow-hidden rounded-md p-2 text-light-200 backdrop-blur-sm'>
                <span className='absolute left-0 top-0 size-full bg-dark-200 opacity-60' />
                <h3 className='relative z-10'>
                  Tu portal a cientos de productos
                </h3>
              </div>
            </div>
            <p className='overflow-hidden rounded-md p-4 text-light-200 backdrop-blur-sm sm:max-w-[80ch]'>
              <span className='absolute left-0 top-0 -z-10 size-full bg-dark-200 opacity-60' />
              Acceda a toda amplia variedad de productos de todo tipo, productos
              relacionados a la alimentacion (...), la higiene, la limpieza, los
              electrodomesticos, muchas variedades de golosinas, entre muchos
              otros.
            </p>
          </section>
          <section className='flex flex-col gap-3'>
            <h3 className='shadow-title text-center text-3xl'>Más populares</h3>
            <div className='grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4'>
              {mostPopulars.map(product => {
                const { name, image } = product
                const urlImage = `${BACKEND_URL}/api/stream/image/${image}`

                return (
                  <article
                    key={nanoid(5)}
                    className={`flex flex-col items-center gap-2 p-3 `}
                  >
                    <div className='relative aspect-square w-full overflow-hidden rounded-lg shadow-skyBlueViolet'>
                      <Image
                        className='object-cover'
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
                    <span className='w-full truncate p-1 text-center'>
                      {product.name}
                    </span>
                    <button className='inline-block cursor-pointer rounded-lg bg-gradient-to-r from-skyviolet to-skyblue p-4 text-xl font-bold text-dark-200 drop-shadow-skyblue transition duration-300 hover:scale-105 hover:drop-shadow-skyviolet'>
                      Comprar
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
          <section className='flex flex-col gap-3'>
            <h3 className='shadow-title text-center text-3xl'>Secciones</h3>
            <div className='flex flex-col gap-8 min-[500px]:grid min-[500px]:grid-cols-2 lg:grid-cols-3'>
              {sections.map(section => (
                <SectionCard key={nanoid(5)} data={section} link={true} />
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </>
  )
}
