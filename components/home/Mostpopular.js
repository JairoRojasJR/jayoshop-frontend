import Image from 'next/image';

export default function Mostpopular({ styles }) {
  return (
    <>
      <section>
        <h3 className="tac">Más populares</h3>
        <div>
          <div className={styles.mpContainer}>
            <div className={`${styles.mpCard} df fdc`}>
              <div className={styles.mpImgContainer}>
                <Image
                  className={styles.mpImg}
                  src={'/Galleta-Nestle-Amor-Chocolate-100g.png'}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={'galleta nestle amor chocolate'}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                />
              </div>
              <span className={styles.mpProductName}>
                Galleta Nestle Amor Chocolate 100g
              </span>
              <button className={styles.mpButton}>COMPRAR</button>
            </div>
            <div className={`${styles.mpCard} df fdc`}>
              <div className={styles.mpImgContainer}>
                <Image
                  className={styles.mpImg}
                  src={'/Galleta-Nestle-Amor-Chocolate-100g.png'}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={'galleta nestle amor chocolate'}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                />
              </div>
              <span className={styles.mpProductName}>
                Galleta Nestle Amor Chocolate 100g
              </span>
              <button className={styles.mpButton}>COMPRAR</button>
            </div>
            <div className={`${styles.mpCard} df fdc`}>
              <div className={styles.mpImgContainer}>
                <Image
                  className={styles.mpImg}
                  src={'/Galleta-Nestle-Amor-Chocolate-100g.png'}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={'galleta nestle amor chocolate'}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                />
              </div>
              <span className={styles.mpProductName}>
                Galleta Nestle Amor Chocolate 100g
              </span>
              <button className={styles.mpButton}>COMPRAR</button>
            </div>
            <div className={`${styles.mpCard} df fdc`}>
              <div className={styles.mpImgContainer}>
                <Image
                  className={styles.mpImg}
                  src={'/Galleta-Nestle-Amor-Chocolate-100g.png'}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={'galleta nestle amor chocolate'}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                />
              </div>
              <span className={styles.mpProductName}>
                Galleta Nestle Amor Chocolate 100g
              </span>
              <button className={styles.mpButton}>COMPRAR</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
