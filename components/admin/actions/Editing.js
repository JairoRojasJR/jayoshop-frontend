import { useState } from 'react';
import FormProduct from '@/components/admin/FormProduct';
import CardProduct from '../CardProduct';
import { closeModal } from '@/services/closeModal';
import { updateProduct, getProducts } from '@/services/products';
import { jtoast } from '@/components/jtoast';

import {
  warnUnsaved,
  cancelUnsaved,
  closeUnsave,
  switchModal,
} from '@/styles/admin/Inventory.module.css';

export default function Editing({ props }) {
  const { adminOp, setAdminOp, setProducts } = props;
  const productInAction = adminOp.productInAction[0];
  const [previewProduct, setPreviewProduct] = useState(productInAction);
  const [unsaved, setUnsaved] = useState(false);
  const [updated, setUpdated] = useState({
    name: false,
    description: false,
    image: false,
    price: false,
    cuantity: false,
    section: false,
    barcode: false,
  });

  const updatePreviewProduct = e => {
    const inputHtml = e.target;
    const prePreviewProduct = { ...previewProduct };
    const preUpdated = { ...updated };

    const field = inputHtml.name;
    let current;
    let file;

    if (inputHtml.files) {
      file = inputHtml.files[0];
      const fileNameInAction = productInAction.image;
      const fileName = file.name;

      const imageNameInAction = fileNameInAction.split(/--id--[\w]+\./)[0];
      const imageInputName = fileName.split('.')[0];

      if (imageNameInAction === imageInputName) current = fileNameInAction;
      else current = file.name;
    } else current = inputHtml.value;

    if (current != productInAction[field]) preUpdated[field] = true;
    else preUpdated[field] = false;

    if (file) {
      const url = URL.createObjectURL(file);
      prePreviewProduct[field] = url;
    } else prePreviewProduct[field] = current;
    setUpdated(preUpdated);
    setPreviewProduct(prePreviewProduct);
  };

  const verifyUnsaved = () => {
    for (let isUpdated in updated) {
      if (updated[isUpdated]) return setUnsaved(true);
    }
    closeModal(adminOp, setAdminOp);
  };

  const sendUpdatedProduct = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    let thereFieldUpdated = false;

    for (let info in updated) {
      const isInfoUpdated = updated[info];
      if (!isInfoUpdated) formData.delete(info);
      else if (!thereFieldUpdated) thereFieldUpdated = true;
    }

    if (thereFieldUpdated) {
      if (updated.image) formData.append('oldImage', productInAction.image);
      const res = await updateProduct(formData);

      if (!res.error) {
        jtoast(res.message, { duration: 3000 });
        getProducts(adminOp.section, setProducts);
        closeModal(adminOp, setAdminOp);
      } else {
        jtoast(res.error, { duration: 3000 });
      }
    } else jtoast('No se ha detectado ningún cambio', { duration: 3000 });
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
          setChange={updatePreviewProduct}
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
