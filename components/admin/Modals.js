import styles from '../../styles/admin/Inventory.module.css';
import { useEffect, useState } from 'react';
import Editing from './actions/Editing';
import Trashing from './actions/Trashing';
import MultipleTrashing from './actions/MultipleTrashing';

export default function Modal({ adminOp, setAdminOp }) {
  const product = adminOp.productInAction[0];
  const [previewProduct, setPreviewProduct] = useState(product);
  const [unsaved, setUnsaved] = useState(false);

  const closeModal = force => {
    if (!force) {
      let thereDiferent = false;

      for (let info in previewProduct) {
        if (previewProduct[info] !== product[info]) thereDiferent = true;
      }

      if (thereDiferent) return setUnsaved(true);
      else setUnsaved(false);
    } else if (force) setUnsaved(false);

    const modal = document.getElementById('modalInventario');
    const preAdminOp = { ...adminOp };
    preAdminOp.modalStatus = 'close';
    if (!adminOp.multipleCheck) preAdminOp.productInAction = [];

    document.body.classList.remove('no-scroll');
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      setAdminOp(preAdminOp);
    }, 300);
  };

  useEffect(() => setPreviewProduct(product), [product]);

  const getModalContent = () => {
    if (adminOp.action[0] === 'edit')
      return Editing({
        adminOp,
        previewProduct,
        setPreviewProduct,
        unsaved,
        setUnsaved,
        closeModal,
      });
    else if (adminOp.action[0] === 'trash' && !adminOp.multipleCheck)
      return Trashing({ adminOp, styles, closeModal });
    else if (adminOp.action[0] === 'trash' && adminOp.multipleCheck)
      return MultipleTrashing({ adminOp, styles, closeModal });
  };

  return (
    <section
      id={'modalInventario'}
      className={`${styles.modal} df fdc jcc aic`}
      onClick={() => closeModal()}
    >
      {product ? getModalContent() : ''}
    </section>
  );
}
