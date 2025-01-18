import { type Metadata } from 'next'

export const metadata: Metadata = { title: 'Sobre nosotros - JayoShop' }

export default function About(): JSX.Element {
  return (
    <div className='p-6 md:p-8 lg:p-16'>
      <h1 className='mx-auto pb-4 text-center text-3xl uppercase drop-shadow-skyblue'>
        Sobre nosotros
      </h1>
      <section className='relative  z-20 mx-auto w-fit overflow-hidden  rounded-lg p-4 text-lg text-dark-200 shadow-skyviolet backdrop-blur-sm dark:text-light-200'>
        <span className='absolute left-0 top-0 size-full bg-light-200 opacity-95 dark:bg-dark-200' />
        <div className='relative z-10 flex max-w-[80ch] flex-col gap-6'>
          <p>
            Bienvenido a nuestra tienda online. Somos una empresa comprometida
            en ofrecer productos de alta calidad a nuestros clientes.
          </p>
          <p>
            Nuestra misión es proporcionar una experiencia de compra
            excepcional, brindando productos únicos y exclusivos.
          </p>
          <p>
            Trabajamos con los mejores proveedores y nos esforzamos por mantener
            altos estándares de calidad en todos nuestros productos.
          </p>
          <p>
            Si tienes alguna pregunta o necesitas ayuda, no dudes en
            contactarnos. ¡Estamos aquí para ayudarte!
          </p>
        </div>
      </section>
    </div>
  )
}
