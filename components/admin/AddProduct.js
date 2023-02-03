import styles from '../../styles/admin/Inventory.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useEffect, useState } from 'react';
import { openFormAdd, closeFormAdd } from '@/services/adminSubNav';

export default function AddProduct() {
  const [statusFormAdd, setStatusFormAdd] = useState('close');

  const switchFormAdd = () => {
    if (statusFormAdd === 'close') setStatusFormAdd('open');
    else setStatusFormAdd('close');
  };

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

  useEffect(() => {
    if (statusFormAdd === 'open') openFormAdd();
    else closeFormAdd();
  }, [statusFormAdd]);

  return (
    <section className={`${styles.extraContainer}`}>
      <button
        className={`${styles.addNewProduct} cp`}
        onClick={() => switchFormAdd()}
      >
        {statusFormAdd === 'close' ? (
          <>
            <FontAwesomeIcon icon={solid('plus')} />
            Agregar nuevo
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={solid('minus')} />
            Ocultar
          </>
        )}
      </button>
      <form className={`${styles.formAdd}`} onSubmit={addProduct}>
        <div className={`${styles.formContent}`}>
          <section className={`${styles.fieldName}`}>
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" defaultValue={'Panchitos picantes'} />
          </section>
          <section className={`${styles.fieldDesc}`}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              className={`${styles.description}`}
              defaultValue={
                'Deliciosos panchitos picantes natural... bla bla bla'
              }
            ></textarea>
          </section>
          <section className={`${styles.fieldPrice}`}>
            <label htmlFor="price">Precio</label>
            <input id="price" name="price" defaultValue={'0.35'} />
          </section>
          <section className={`${styles.fieldCuantity}`}>
            <label htmlFor="cuantity">Cantidad</label>
            <input id="cuantity" name="cuantity" defaultValue={'5'} />
          </section>
          <section className={`${styles.fieldSection}`}>
            <label htmlFor="section">Sección</label>
            <input id="section" name="section" defaultValue={'Alimentos'} />
          </section>
          <section className={`${styles.fieldBarcode}`}>
            <label htmlFor="barcode">Código de barras</label>
            <input id="barcode" name="barcode" defaultValue={'777'} />
          </section>
          <input
            className={`${styles.addNewProduct} cp`}
            value={'Añadir'}
            type={'submit'}
          />
        </div>
      </form>
    </section>
  );
}
