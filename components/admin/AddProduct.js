import styles from '../../styles/admin/Inventory.module.css';
import { useEffect, useState } from 'react';
import { openFormAdd, closeFormAdd } from '@/services/adminSubNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import FormProduct from './FormProduct';

export default function AddProduct({ reloadProducts }) {
  const [statusFormAdd, setStatusFormAdd] = useState('close');
  const devDataProduct =
    process.env.NEXT_PUBLIC_MODE === 'dev'
      ? {
          name: 'Galleta amor chocolate',
          description: 'Disfruta de la deleciosa galleta amor chocolate, bla bla bla',
          price: '1$',
          cuantity: '5',
          section: 'Golosinas',
          barcode: 999,
        }
      : {};

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
    formData.section = formData.section.toLowerCase();
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
        reloadProducts(res.product);
      });
  };

  useEffect(() => {
    if (statusFormAdd === 'open') openFormAdd();
    else closeFormAdd();
  }, [statusFormAdd]);

  return (
    <section className={`${styles.extraContainer}`}>
      <button
        className={`${styles.goal} df jcc cp`}
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
      <FormProduct
        dataProduct={devDataProduct}
        runSubmit={addProduct}
        title={'Nuevo producto'}
        goal={'Añadir'}
      />
    </section>
  );
}
