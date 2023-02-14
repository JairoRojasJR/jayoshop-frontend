import CardProduct from '../CardProduct';

export default function Trashing({ adminOp, styles, closeModal }) {
  return (
    <>
      <div onClick={e => e.stopPropagation()}>
        <CardProduct product={adminOp.productInAction[0]} />
        <article
          className={`${styles.warningTrash} df fdc`}
          onClick={e => e.stopPropagation()}
        >
          <p>
            Seguro que desea eliminar este producto del inventario, esta acción
            es irreversible.
          </p>
          <div className={`df jcc`} style={{ gap: '1rem' }}>
            <button
              className={`${styles.warningOption} cp`}
              style={{
                background: 'var(--primary)',
                color: 'var(--darksecondary)',
              }}
              onClick={() => closeModal(adminOp.action)}
            >
              Cancelar
            </button>
            <button
              className={`${styles.warningOption} cp`}
              style={{ background: '#F91444' }}
              onClick={() => sendDeleteProduct()}
            >
              Si, eliminar
            </button>
          </div>
        </article>
      </div>
    </>
  );
}
