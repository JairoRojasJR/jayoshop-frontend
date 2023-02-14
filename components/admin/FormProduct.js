import styles from '../../styles/admin/Inventory.module.css';

export default function FormProduct({
  extraStyles,
  runSubmit,
  dataProduct,
  title,
  goal,
  setChange,
}) {
  const { name, description, price, cuantity, section, barcode } = dataProduct
    ? dataProduct
    : {};

  return (
    <form
      className={`${styles.formAdd}`}
      style={extraStyles ? extraStyles : {}}
      onClick={e => e.stopPropagation()}
      onSubmit={e => runSubmit(e)}
    >
      <div className={`${styles.formContent}`}>
        {title ? (
          <section
            className={`${styles.fieldName}`}
            style={{
              justifySelf: 'flex-end',
              borderBottom: '.3rem solid #7fffd4',
            }}
          >
            <h3 style={{ fontSize: '1rem' }}>{title}</h3>
          </section>
        ) : (
          ''
        )}
        <input name="id" defaultValue={dataProduct._id} type={'hidden'} />
        <section className={`${styles.fieldName}`}>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            defaultValue={dataProduct ? name : ''}
            onChange={setChange}
          />
        </section>
        <section className={`${styles.fieldDesc}`}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            className={`${styles.description}`}
            defaultValue={dataProduct ? description : ''}
            onChange={setChange}
          ></textarea>
        </section>
        <section className={`${styles.fieldPrice}`}>
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            name="price"
            defaultValue={dataProduct ? price : ''}
            onChange={setChange}
          />
        </section>
        <section className={`${styles.fieldCuantity}`}>
          <label htmlFor="cuantity">Cantidad</label>
          <input
            id="cuantity"
            name="cuantity"
            defaultValue={dataProduct ? cuantity : ''}
            onChange={setChange}
          />
        </section>
        <section className={`${styles.fieldSection}`}>
          <label htmlFor="section">Sección</label>
          <input
            id="section"
            name="section"
            defaultValue={dataProduct ? section : ''}
            onChange={setChange}
          />
        </section>
        <section className={`${styles.fieldBarcode}`}>
          <label htmlFor="barcode">Código de barras</label>
          <input
            id="barcode"
            name="barcode"
            defaultValue={dataProduct ? barcode : ''}
            onChange={setChange}
          />
        </section>
        <section className={`${styles.fieldGoal}`}>
          <input
            className={`${styles.goal} df jcc cp`}
            value={goal}
            type={'submit'}
          />
        </section>
      </div>
    </form>
  );
}
