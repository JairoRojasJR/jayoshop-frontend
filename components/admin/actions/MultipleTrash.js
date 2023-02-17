import {
  warningTrash,
  warningOption,
  switchModal,
  cardsContainer,
} from '@/styles/admin/Inventory.module.css';
import CardProduct from '../CardProduct';
import { nanoid } from 'nanoid';
import { closeModal } from '@/services/closeModal';

export default function MultipleTrashing({ props }) {
  const { adminOp, setAdminOp, selecteds, products } = props;
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
    console.log('Eliminando los productos...');
    console.log(outputProducts);
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
