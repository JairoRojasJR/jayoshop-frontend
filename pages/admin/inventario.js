import styles from '../../styles/admin/Inventory.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import Layout from '@/components/Layout';
import Ui from '@/components/admin/Ui';
import AddProduct from '@/components/admin/AddProduct';
import PlusOption from '@/components/admin/PlusOptions';
import SubNav from '@/components/admin/SubNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { jtoast, JToast } from '@/components/jtoast';

export default function Inventory() {
  const [currentProducts, setCurrentProducts] = useState([]);
  const productsSections = ['todo', 'alimentos', 'bebidas', 'golosinas'];

  const router = useRouter();

  const getProducts = section => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/inventario?section=${
        section || 'todo'
      }`,
      {
        credentials: 'include',
      }
    )
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) setCurrentProducts([...res]);
      });
  };

  const reloadProducts = product => {
    if (
      product.section === router.query?.section ||
      JSON.stringify(router.query) === '{}'
    )
      setCurrentProducts([...currentProducts, product]);
  };

  const showMsg = msg => jtoast(msg, { duration: 3000 });

  const copyToClipboard = str => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      showMsg('Código de barras copiado al portapapeles 📋');
      return navigator.clipboard.writeText(str);
    }
    return showMsg('💔 La API de portapapeles no está disponible');
  };

  useEffect(() => {
    getProducts(router.query?.section);
  }, [router.query]);

  return (
    <Layout>
      <JToast></JToast>
      <Ui currentSection="inventario">
        <PlusOption style={{ width: '90%' }} plus={true}>
          <AddProduct position={'in'} reloadProducts={reloadProducts} />
          <SubNav position={'out'} productsSections={productsSections} />
        </PlusOption>
        <section className={`${styles.productsContainer} df fdc`}>
          {Array.isArray(currentProducts)
            ? currentProducts.map(product => {
                return (
                  <article
                    id={product._id}
                    className={`${styles.product}`}
                    key={nanoid(10)}
                  >
                    <span
                      className={`${styles.productComponent} ${styles.image} df jcc pr`}
                    >
                      {JSON.stringify(router.query) === '{}' ? (
                        <div
                          className={`${styles.floatInfoProduct} ${styles.section} tac pa`}
                        >
                          {product.section[0].toUpperCase() +
                            product.section.slice(1)}
                        </div>
                      ) : (
                        ''
                      )}
                      <Image
                        src={'/panchitos.jpg'}
                        fill
                        alt="panchitos"
                        style={{ objectFit: 'cover', borderRadius: '.3rem' }}
                        sizes="(max-width: 768px) 100vw,
                                (max-width: 1200px) 50vw,
                                33vw"
                      />
                    </span>
                    <h3
                      className={`${styles.productComponent} ${styles.title}`}
                    >
                      {product.name}
                    </h3>
                    <div
                      className={`${styles.productComponent} ${styles.desc}`}
                    >
                      {product.description}
                    </div>
                    <span className={`${styles.barcode} df jcc`}>
                      <span
                        className={`cp`}
                        onClick={() => copyToClipboard(product.barcode)}
                      >
                        <FontAwesomeIcon icon={solid('barcode')} />
                        <FontAwesomeIcon icon={solid('barcode')} />
                      </span>
                    </span>
                    <div
                      className={`${styles.productComponent} ${styles.infoProduct} df jcfe`}
                    >
                      <span
                        className={`${styles.productComponent} ${styles.stock}`}
                      >
                        <FontAwesomeIcon icon={solid('layer-group')} />x
                        {product.cuantity}
                      </span>
                      <span
                        className={`${styles.productComponent} ${styles.precio}`}
                      >
                        <FontAwesomeIcon icon={solid('money-bill')} />
                        {product.price}$
                      </span>
                    </div>
                  </article>
                );
              })
            : ''}
        </section>
      </Ui>
    </Layout>
  );
}
