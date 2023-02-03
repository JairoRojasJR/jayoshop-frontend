import styles from '../../styles/admin/Inventory.module.css';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Ui from '@/components/admin/Ui';
import AddProduct from '@/components/admin/AddProduct';

export default function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (products.length === 0) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/inventario`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          setProducts(res);
        });
    }
  }, []);

  return (
    <Layout>
      <Ui currentSection="inventario" AddProduct={AddProduct}>
        <section className={`${styles.productsContainer} df fdc`}>
          {products.map(product => {
            return (
              <article className={`${styles.product}`} key={nanoid(10)}>
                <span
                  className={`${styles.productComponent} ${styles.image} pr`}
                >
                  <Image
                    src={'/panchitos.jpg'}
                    fill
                    alt="panchitos"
                    style={{ objectFit: 'cover' }}
                  />
                </span>
                <h3 className={`${styles.productComponent} ${styles.title}`}>
                  {product.name}
                </h3>
                <div className={`${styles.productComponent} ${styles.desc}`}>
                  {product.description}
                </div>
                <span className={`${styles.productComponent} ${styles.stock}`}>
                  x{product.cuantity} U.
                </span>
                <span className={`${styles.productComponent} ${styles.precio}`}>
                  {product.price}$
                </span>
              </article>
            );
          })}
        </section>
      </Ui>
    </Layout>
  );
}