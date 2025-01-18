import Image from 'next/image'
import Link from 'next/link'
import { SectionCard } from '@/components/Cards'
import { getMostPopularsProducts, getSections } from '@/services/inventory'
import BuildingStore from '@/svg/BuildingStore'
import { STREAM_IMAGE } from '@/app/consts'
import style from '@/css/Home.module.css'

export default async function Home(): Promise<JSX.Element> {
  const mostPopulars = await getMostPopularsProducts()
  const sections = await getSections()

  return (
    <>
      <section className={`${style.hero} ${style.section}`}>
        <h1>
          Tienda del barrio <span className='shadow-title'>JayoShop</span>
        </h1>
        <div className={style.hero__presentation}>
          <BuildingStore className={style.hero__background__icon} />
          <Image
            className={style.hero__businessman}
            alt='empresario'
            src='/businessman-sm.webp'
            width={300}
            height={575}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority
          />
        </div>
        <aside className={style.hero__aside}>
          <p>Productos de calidad al mejor precio</p>
          <Link className={style.call__to__action} href='/productos'>
            Empezar a comprar
          </Link>
        </aside>
      </section>
      <section className={`${style.presentation} ${style.section}`}>
        <div>
          <Image
            alt='estanteria de productos'
            src='/estanteria-de-productos.webp'
            width={500}
            height={547}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          <span className={style.presentation__text__img}>
            Tu portal a cientos de productos
          </span>
        </div>
        <p className={style.presentation__text}>
          Acceda a toda amplia variedad de productos de todo tipo, productos
          relacionados a la alimentacion (...), la higiene, la limpieza, los
          electrodomesticos, muchas variedades de golosinas, entre muchos otros.
        </p>
      </section>
      <section className={`${style.products} ${style.section}`}>
        <h3 className='title shadow-title'>Más populares</h3>
        <div>
          {mostPopulars.map(({ _id, name, image }) => {
            const urlImg = `${STREAM_IMAGE}/${image}`
            return (
              <article key={crypto.randomUUID()} className={style.product}>
                <Image
                  alt={name}
                  src={urlImg}
                  // loader={imageLoader}
                  width={150}
                  height={150}
                  sizes='(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw'
                />
                <div>
                  <span className={style.product__name}>{name}</span>
                  <Link
                    className={style.call__to__action}
                    href={`/productos#${_id}`}
                  >
                    Comprar
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <section className={`${style.sections} ${style.section}`}>
        <h3 className='title shadow-title'>Secciones</h3>
        <div>
          {sections.map(section => (
            <Link
              key={crypto.randomUUID()}
              href={`/productos?section=${section.name}`}
            >
              <SectionCard data={section} />
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
