import Image from 'next/image';

export default function Portal() {
  return (
    <>
      <section style={{ padding: '1rem' }}>
        <div className="df aic jcc pr">
          <Image
            src={'/estanteria-de-productos.png'}
            width={200}
            height={200}
            alt={'estanteria de productos'}
            style={{ objectFit: 'cover', borderRadius: '.5rem' }}
          />
          <h3
            style={{
              margin: '0',
              position: 'absolute',
              top: '90%',
              left: '30%',
              fontFamily: 'sans-serif',
            }}
          >
            Tu portal a cientos de productos
          </h3>
        </div>
        <p style={{ marginTop: '3rem', padding: '.3rem' }}>
          Acceda a toda amplia variedad de productos de todo tipo, productos
          relacionados a la alimentacion (...), la higiene, la limpieza, los
          electrodomesticos, muchas variedades de golosinas, entre muchos otros.
        </p>
      </section>
    </>
  );
}
