import FormProduct from '@/components/admin/FormProduct';
import CardProduct from '../CardProduct';
import {
  warnUnsaved,
  cancelUnsaved,
  closeUnsave,
} from '@/styles/admin/Inventory.module.css';

export default function Editing({
  previewProduct,
  setPreviewProduct,
  unsaved,
  setUnsaved,
  closeModal,
}) {
  const updateProduct = e => {
    const inputHtml = e.target;
    const productUpdated = { ...previewProduct };
    productUpdated[inputHtml.name] = inputHtml.value;
    setPreviewProduct(productUpdated);
  };

  return (
    <div onClick={e => e.stopPropagation()}>
      {previewProduct ? (
        <div className={`pr`}>
          <CardProduct product={previewProduct} />
          <FormProduct
            extraStyles={{
              display: 'block',
              height: 'auto',
              padding: '1rem',
              marginTop: '0',
            }}
            // runSubmit={runSubmit}
            dataProduct={previewProduct}
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
                    onClick={() => closeModal(true)}
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
      ) : (
        ''
      )}
    </div>
  );
}
