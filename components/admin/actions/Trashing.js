import CardProduct from '../CardProduct';
import {
  warningTrash,
  warningOption,
  switchModal,
} from '@//styles/admin/Inventory.module.css';
import { closeModal } from '@/services/closeModal';
import { deleteProducts, getProducts } from '@/services/products';
import { jtoast } from '@/components/jtoast';

export default function Trashing({ props }) {
  const { adminOp, setAdminOp, setProducts } = props;
  const { productInAction } = adminOp;

  const sendDeleteProduct = async () => {
    const res = await deleteProducts(productInAction);
    if (res.status === 'ok') {
      getProducts(adminOp.section, setProducts);
    }
    jtoast(res.msg, { duration: 3000 });
    closeModal(adminOp, setAdminOp);
  };

  return (
    <article
      className={`${switchModal} df fdc jcc aic`}
      onClick={() => closeModal(adminOp, setAdminOp)}
    >
      <div
        className={`df fdc`}
        style={{ maxHeight: '90%' }}
        onClick={e => e.stopPropagation()}
      >
        <CardProduct product={productInAction[0]} />
        <article
          className={`${warningTrash} df fdc`}
          onClick={e => e.stopPropagation()}
        >
          <p>
            Seguro que desea eliminar este producto del inventario, esta acción
            es irreversible.
          </p>
          <div className={`df jcc`} style={{ gap: '1rem' }}>
            <button
              className={`${warningOption} cp`}
              style={{
                background: 'var(--primary)',
                color: 'var(--darksecondary)',
              }}
              onClick={() => closeModal(adminOp, setAdminOp)}
            >
              Cancelar
            </button>
            <button
              className={`${warningOption} cp`}
              style={{ background: '#F91444' }}
              onClick={() => sendDeleteProduct()}
            >
              Si, eliminar
            </button>
          </div>
        </article>
      </div>
    </article>
  );
}
