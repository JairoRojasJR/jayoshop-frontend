import styles from '../../styles/admin/Inventory.module.css';
import { useEffect, useState } from 'react';
import { openFormAdd, closeFormAdd } from '@/services/adminSubNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import FormProduct from './FormProduct';
import { addProduct, getProducts } from '@/services/products';
import { jtoast } from '@/components/jtoast';

export default function AddProduct({ section, setProducts }) {
  const [statusFormAdd, setStatusFormAdd] = useState('close');
  const devDataProduct =
    process.env.NEXT_PUBLIC_MODE === 'dev'
      ? {
          name: 'Galleta amor chocolate',
          description: 'Descripción del producto...',
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

  const sendProduct = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const res = await addProduct(formData);

    if (!res.error) {
      jtoast(res.message, { duration: 3000 });
      getProducts(section, setProducts);
    } else {
      jtoast(res.error, { duration: 3000 });
    }
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
        runSubmit={sendProduct}
        title={'Nuevo producto'}
        goal={'Añadir'}
      />
    </section>
  );
}
