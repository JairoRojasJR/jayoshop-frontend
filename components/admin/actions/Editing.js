import {
  warnUnsaved,
  cancelUnsaved,
  closeUnsave,
  switchModal,
} from '@/styles/admin/Inventory.module.css';
import { useState } from 'react';
import FormProduct from '@/components/admin/FormProduct';
import CardProduct from '../CardProduct';
import { closeModal } from '@/services/closeModal';
import { getProducts, updateProducts } from '@/services/products';
import { jtoast } from '@/components/jtoast';

export default function Editing({ props }) {
  const { adminOp, setAdminOp, setProducts } = props;
  const productInAction = adminOp.productInAction[0];
  const [previewProduct, setPreviewProduct] = useState(productInAction);
  const [unsaved, setUnsaved] = useState(false);
  const [updated, setUpdated] = useState({
    name: false,
    description: false,
    price: false,
    cuantity: false,
    section: false,
    barcode: false,
  });

  const updateProduct = e => {
    const inputHtml = e.target;
    const prePreviewProduct = { ...previewProduct };
    prePreviewProduct[inputHtml.name] = inputHtml.value;

    const preUpdated = { ...updated };
    for (let info in preUpdated) {
      const matchInfo = prePreviewProduct[info];
      if (matchInfo) {
        const thereDiferent = productInAction[info] !== prePreviewProduct[info];
        if (thereDiferent) preUpdated[info] = true;
        else preUpdated[info] = false;
      }
    }
    setUpdated(preUpdated);
    setPreviewProduct(prePreviewProduct);
  };

  const verifyUnsaved = () => {
    for (let info in productInAction) {
      if (productInAction[info] != previewProduct[info])
        return setUnsaved(true);
    }
    closeModal(adminOp, setAdminOp);
  };

  const sendUpdatedProduct = async e => {
    e.preventDefault();
    const infoToSend = { _id: previewProduct._id };
    for (let info in updated) {
      const isInfoUpdated = updated[info];
      if (isInfoUpdated) infoToSend[info] = previewProduct[info];
    }

    const res = await updateProducts([infoToSend]);
    if (res.status === 'ok') {
      getProducts(adminOp.section, setProducts);
    }
    jtoast(res.msg, { duration: 3000 });
    closeModal(adminOp, setAdminOp);
  };

  return (
    <article
      className={`${switchModal} df fdc jcc aic`}
      onClick={() => verifyUnsaved()}
    >
      <div
        className={`df fdc`}
        style={{ maxHeight: '90%' }}
        onClick={e => e.stopPropagation()}
      >
        <CardProduct product={previewProduct} updated={updated} />
        <FormProduct
          extraStyles={{
            display: 'block',
            height: 'auto',
            padding: '1rem',
            marginTop: '0',
            overflowY: 'auto',
          }}
          runSubmit={sendUpdatedProduct}
          dataProduct={productInAction}
          title={'Edición'}
          goal={'Confirmar cambios'}
          setChange={updateProduct}
        />
        {unsaved ? (
          <span className={`${warnUnsaved} df aic jcc w100p h100p pa`}>
            <section className={`df fdc`} style={{ gap: '1rem' }}>
              <p>Hay cambios sin guardar, ¿seguro que desea continuar?</p>
              <div className={`df jcse`} style={{ gap: '1rem' }}>
                <button
                  className={`${cancelUnsaved} cp`}
                  onClick={() => setUnsaved(false)}
                >
                  Cancelar
                </button>
                <button
                  className={`${closeUnsave} cp`}
                  onClick={() => closeModal(adminOp, setAdminOp)}
                >
                  Si, cerrar sin guardar
                </button>
              </div>
            </section>
          </span>
        ) : (
          ''
        )}
      </div>
    </article>
  );
}
