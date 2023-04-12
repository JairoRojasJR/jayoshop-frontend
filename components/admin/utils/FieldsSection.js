import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

export default function FieldsSection({ data, setChange }) {
  const { name } = data || {}
  return (
    <>
      <section className='spanC2 df fdc'>
        <label className='cp' htmlFor={`nameSection${nanoid(5)}`}>
          Nombre
        </label>
        <input
          id={`nameSection${nanoid(5)}`}
          name='name'
          defaultValue={name}
          onChange={setChange}
        />
      </section>
      <section className='spanC2 df fdc'>
        <label className='cp' htmlFor={`imageSection${nanoid(5)}`}>
          Imagen
        </label>
        <input
          id={`imageSection${nanoid(5)}`}
          name='image'
          type='file'
          onChange={setChange}
        />
      </section>
    </>
  )
}

FieldsSection.propTypes = {
  data: PropTypes.object,
  setChange: PropTypes.func
}
