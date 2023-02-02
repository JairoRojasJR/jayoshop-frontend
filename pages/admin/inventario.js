import styles from '../../styles/Inventory.module.css';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Ui from '@/components/admin/Ui';
import { useIsAuthContext } from '@/context/isAuth';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const { isAuthContext } = useIsAuthContext();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/inventario`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(res => {
        setProducts(res);
      });
  }, []);

  const addProduct = e => {
    e.preventDefault();
    const form = e.target;
    const formData = Object.fromEntries(new FormData(form));
    formData.cuantity = parseInt(formData.cuantity);
    formData.barcode = parseInt(formData.barcode);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/inventario`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  };

  return (
    <Layout>
      {isAuthContext.authenticated ? (
        <Ui>
          <section className={`${styles.productsContainer} df fdc`}>
            <div style={{ padding: '1rem' }}>
              <form className={`df fdc`} onSubmit={addProduct}>
                <label>Añadir producto al inventario</label>
                <label htmlFor="name">Nombre:</label>
                <input
                  id="name"
                  name="name"
                  defaultValue={'Panchitos picantes'}
                />
                <label htmlFor="price">Precio:</label>
                <input id="price" name="price" defaultValue={'0.35'} />
                <label htmlFor="description">Descripción</label>
                <input
                  id="description"
                  name="description"
                  defaultValue={
                    'Deliciosos panchitos picantes natural... bla bla bla'
                  }
                />
                <label htmlFor="cuantity">Cantidad</label>
                <input id="cuantity" name="cuantity" defaultValue={'5'} />
                <label htmlFor="barcode">Código de barras:</label>
                <input id="barcode" name="barcode" defaultValue={'777'} />
                <input className={`cp`} value={'Añadir'} type={'submit'} />
              </form>
            </div>
            {Array.isArray(products)
              ? products.map(product => {
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
      ) : (
        ''
      )}
    </Layout>
  );
}
