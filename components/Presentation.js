import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function Presentation({ styles }) {
  return (
    <section className="df fdc pr fg1" style={{ marginTop: '5rem' }}>
      <h1 className={styles.title}>
        Tienda del barrio San Francisco <span>La veci</span>
      </h1>
      <div className={styles.headerpresentation}>
        <div className={styles.misscontainer}>
          <Image
            className={`${styles.miss} pa`}
            src={'/miss.png'}
            fill
            alt={'empresaria'}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0px 0px 10px #000)',
            }}
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          />
        </div>
        <FontAwesomeIcon className={styles.store} icon={solid('store')} />
        <div className={styles.desc}>
          <p>
            Todos los productos que puedas necesitar aqui en tu tienda del
            barrio La veci
          </p>
          <Link href={'/products'}>
            <button>EMPEZAR A COMPRAR</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
