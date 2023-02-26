import CardProduct from '../CardProduct';
import { nanoid } from 'nanoid';
import { closeModal } from '@/services/closeModal';
import { deleteProduct, getProducts } from '@/services/products';
import { jtoast } from '@/components/jtoast';

import {
  warningTrash,
  warningOption,
  switchModal,
  cardsContainer,
} from '@/styles/admin/Inventory.module.css';

export default function MultipleTrashing({ props }) {
  const { adminOp, setAdminOp, selecteds, products, setProducts } = props;
  const outputProducts = [];

  for (let selected in selecteds) {
    for (let product of products) {
      if (product._id == selected) {
        outputProducts.push(product);
        break;
      }
    }
  }

  const sendDeleteProducts = async () => {
    const res = await deleteProduct(outputProducts);
    if (!res.error) {
      jtoast(res.message, { duration: 3000 });
      getProducts(adminOp.section, setProducts);
    } else {
      jtoast(res.error, { duration: 3000 });
    }
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
        <section className={`${cardsContainer} df fdc`}>
          {outputProducts.map(product => (
            <CardProduct key={nanoid(10)} product={product} />
          ))}
        </section>
        <section
          className={`${warningTrash} df fdc`}
          style={{ flexGrow: '.5' }}
        >
          <p>
            Seguro que desea eliminar todos estos productos del inventario, esta
            acción es irreversible.
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
              onClick={() => sendDeleteProducts()}
            >
              Si, eliminar
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}
