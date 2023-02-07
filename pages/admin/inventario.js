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

  useEffect(() => {
    getProducts(router.query?.section);
  }, [router.query]);

  return (
    <Layout>
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
                      className={`${styles.productComponent} ${styles.image} pr`}
                    >
                      <Image
                        src={'/panchitos.jpg'}
                        fill
                        alt="panchitos"
                        style={{ objectFit: 'cover' }}
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
                    <span
                      className={`${styles.productComponent} ${styles.stock}`}
                    >
                      x{product.cuantity} U.
                    </span>
                    <span
                      className={`${styles.productComponent} ${styles.precio}`}
                    >
                      {product.price}$
                    </span>
                  </article>
                );
              })
            : ''}
        </section>
      </Ui>
    </Layout>
  );
}
