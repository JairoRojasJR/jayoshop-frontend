import Image from 'next/image';

export default function Categories({ styles }) {
  return (
    <>
      <section>
        <h3 className="tac">Categorias</h3>
        <div className={`${styles.categorieContainer} df fdc`}>
          <div className={`${styles.categorieCard} pr`}>
            <Image src={'/alimentos.png'} fill alt="alimentos" />
            <span className={styles.categorieTitle}>Alimentos</span>
          </div>
          <div className={`${styles.categorieCard} pr`}>
            <Image src={'/alimentos.png'} fill alt="alimentos" />
            <span className={styles.categorieTitle}>Alimentos</span>
          </div>
          <div className={`${styles.categorieCard} pr`}>
            <Image src={'/alimentos.png'} fill alt="alimentos" />
            <span className={styles.categorieTitle}>Alimentos</span>
          </div>
          <div className={`${styles.categorieCard} pr`}>
            <Image src={'/alimentos.png'} fill alt="alimentos" />
            <span className={styles.categorieTitle}>Alimentos</span>
          </div>
        </div>
      </section>
    </>
  );
}
