import CardProduct from '../CardProduct';
import { nanoid } from 'nanoid';

export default function MultipleTrashing({ adminOp, styles, closeModal }) {
  return (
    <>
      <div onClick={e => e.stopPropagation()}>
        {adminOp.productInAction.map(product => (
          <CardProduct key={nanoid(10)} product={product} />
        ))}
      </div>
      <article
        className={`${styles.warningTrash} df fdc`}
        onClick={e => e.stopPropagation()}
      >
        <p>
          Seguro que desea eliminar todos estos productos del inventario, esta
          acción es irreversible.
        </p>
        <div className={`df jcc`} style={{ gap: '1rem' }}>
          <button
            className={`${styles.warningOption} cp`}
            style={{
              background: 'var(--primary)',
              color: 'var(--darksecondary)',
            }}
            onClick={() => closeModal('multipleCheck')}
          >
            Cancelar
          </button>
          <button
            className={`${styles.warningOption} cp`}
            style={{ background: '#F91444' }}
            onClick={() => sendDeleteProducts()}
          >
            Si, eliminar
          </button>
        </div>
      </article>
    </>
  );
}
