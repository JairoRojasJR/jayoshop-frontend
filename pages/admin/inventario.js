import styles from '../../styles/admin/Inventory.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import { getProducts } from '@/services/products';
import Layout from '@/components/Layout';
import Ui from '@/components/admin/Ui';
import AddProduct from '@/components/admin/AddProduct';
import PlusOption from '@/components/admin/PlusOptions';
import SubNav from '@/components/admin/SubNav';
import CardProduct from '@/components/admin/CardProduct';
import ActionsAdmin from '@/components/admin/actions/ActionsAdmin';
import Modal from '@/components/admin/Modals';

export default function Inventory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [adminOp, setAdminOp] = useState({
    section: null,
    action: [],
    modalStatus: 'close',
    multipleCheck: false,
    productInAction: [],
  });

  const reloadProducts = product => {
    if (
      product.section === router.query?.section ||
      JSON.stringify(router.query) === '{}'
    )
      setProducts([...products, product]);
  };

  useEffect(() => {
    const sectionQuery = router.query.section;

    if (adminOp.section !== sectionQuery) {
      const preAdminOp = { ...adminOp };
      preAdminOp.section = sectionQuery;
      getProducts(sectionQuery, setProducts);
      setAdminOp({ ...preAdminOp });
    } else if (JSON.stringify(router.query) === '{}' && !adminOp.section) {
      getProducts(sectionQuery, setProducts);
    }

    if (adminOp.productInAction.length > 0) {
      const preAdminOp = { ...adminOp };
      preAdminOp.productInAction = [];
      setAdminOp(preAdminOp);
    }
  }, [router.query?.section]);

  return (
    <Layout>
      <Ui currentSection="inventario">
        <PlusOption style={{ width: '90%' }} plus={true}>
          <AddProduct position={'in'} reloadProducts={reloadProducts} />
          <SubNav position={'out'} />
        </PlusOption>
        <section className={`${styles.productsContainer} df fdc`}>
          {Array.isArray(products)
            ? products.map(product => {
                return (
                  <CardProduct
                    key={nanoid(10)}
                    product={product}
                    adminOp={adminOp}
                    setAdminOp={setAdminOp}
                  />
                );
              })
            : ''}
        </section>
        <Modal products={products} adminOp={adminOp} setAdminOp={setAdminOp} />
        <ActionsAdmin adminOp={adminOp} setAdminOp={setAdminOp} />
      </Ui>
    </Layout>
  );
}
