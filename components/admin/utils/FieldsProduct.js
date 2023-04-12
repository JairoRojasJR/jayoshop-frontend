import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

export default function FieldsProducts({ data, setChange }) {
  const field = ({ name, label, span, isTextArea, type }) => {
    const id = name + nanoid(5)
    const style = span ? { gridColumn: 'span 2' } : null
    const defaultValue = data && type !== 'file' ? data[name] : null

    return (
      <section className='df fdc' style={style}>
        <label className='cp' htmlFor={id}>
          {label}
        </label>
        {!isTextArea ? (
          <input
            id={id}
            name={name}
            type={type}
            defaultValue={defaultValue}
            onChange={setChange}
          />
        ) : (
          <textarea
            id={id}
            name={name}
            defaultValue={defaultValue}
            onChange={setChange}
          ></textarea>
        )}
      </section>
    )
  }

  return (
    <>
      {field({ name: 'name', label: 'Nombre', span: true })}
      {field({
        name: 'description',
        label: 'Descripción',
        span: true,
        isTextArea: true
      })}
      {field({ name: 'image', label: 'Imagen', span: true, type: 'file' })}
      {field({ name: 'price', label: 'Precio' })}
      {field({ name: 'cuantity', label: 'Cantidad' })}
      {field({ name: 'section', label: 'Sección' })}
      {field({ name: 'barcode', label: 'Código de barras' })}
    </>
  )
}

FieldsProducts.propTypes = {
  data: PropTypes.object,
  setChange: PropTypes.func
}
