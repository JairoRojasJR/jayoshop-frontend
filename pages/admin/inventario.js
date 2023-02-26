import { productsContainer, modal } from '@/styles/admin/Inventory.module.css';
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

import Editing from '@/components/admin/actions/Editing';
import Trashing from '@/components/admin/actions/Trashing';
import MultipleTrashing from '@/components/admin/actions/MultipleTrash';

export default function Inventory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [adminOp, setAdminOp] = useState({
    section: null,
    action: [],
    multipleCheck: false,
    modalStatus: 'close',
    productInAction: [],
    unsaved: false,
  });
  const [selecteds, setSelecteds] = useState([]);
  const { action, productInAction, modalStatus } = adminOp;

  const actionsInModal = [
    {
      ready: action[0] === 'edit' && productInAction[0],
      Component: Editing,
      props: { adminOp, setAdminOp, setProducts },
    },
    {
      ready: action[0] === 'trash' && productInAction[0],
      Component: Trashing,
      props: { adminOp, setAdminOp, setProducts },
    },
    {
      ready: Object.entries(selecteds).length > 0 && modalStatus === 'open',
      Component: MultipleTrashing,
      props: { adminOp, setAdminOp, selecteds, products, setProducts },
    },
  ];

  useEffect(() => {
    if (router.isReady) {
      const isQueryEmpty = Object.entries(router.query).length === 0;
      const sectionQuery = router.query.section;

      const resetProducts = (sectionQuery, isQueryEmpty) => {
        const preAdminOp = { ...adminOp };
        preAdminOp.section = isQueryEmpty ? 'todo' : sectionQuery;
        preAdminOp.productInAction = [];
        setAdminOp(preAdminOp);
        setSelecteds({});
      };

      const currentSection = adminOp.section;
      if (currentSection === null) resetProducts(sectionQuery, isQueryEmpty);
      else {
        const toSectionTodo = isQueryEmpty && currentSection !== 'todo';
        const toOtherSection = !isQueryEmpty && currentSection !== sectionQuery;
        if (toSectionTodo || toOtherSection) {
          resetProducts(sectionQuery, isQueryEmpty);
        }
      }
    }
  }, [router.query?.section]);

  useEffect(() => {
    const isSectionChanged = router.isReady && adminOp.section;
    if (isSectionChanged) getProducts(adminOp.section, setProducts);
  }, [adminOp.section]);

  useEffect(() => {
    setSelecteds([]);
  }, [products]);

  return (
    <Layout>
      <Ui currentSection="inventario">
        <PlusOption style={{ width: '90%' }} plus={true}>
          <AddProduct
            position={'in'}
            section={adminOp.section}
            setProducts={setProducts}
          />
          <SubNav position={'out'} />
        </PlusOption>
        <section className={`${productsContainer} df fdc`}>
          {Array.isArray(products)
            ? products.map(product => {
                return (
                  <CardProduct
                    key={nanoid(10)}
                    product={product}
                    adminOp={adminOp}
                    setAdminOp={setAdminOp}
                    selecteds={selecteds}
                    setSelecteds={setSelecteds}
                  />
                );
              })
            : ''}
        </section>
        <section id={'modalInventario'} className={`${modal}`}>
          {actionsInModal.map(action => {
            const { ready, Component, props } = action;
            if (ready) return <Component key={nanoid(10)} props={props} />;
          })}
        </section>
        {products.length > 0 ? (
          <ActionsAdmin
            adminOp={adminOp}
            setAdminOp={setAdminOp}
            selecteds={selecteds}
            setSelecteds={setSelecteds}
          />
        ) : (
          ''
        )}
      </Ui>
    </Layout>
  );
}
