import { nanoid } from 'nanoid'
import type { Product } from '@/types'

type Props = {
  data?: Product
  setChange?: () => void
}

export default function FieldsProducts({
  data,
  setChange
}: Props): JSX.Element {
  type FieldProps = {
    name: keyof Product
    label: string
    span?: boolean
    isTextArea?: boolean
    type?: string
  }

  const field = ({
    name,
    label,
    span,
    isTextArea,
    type
  }: FieldProps): JSX.Element => {
    const id = name + nanoid(5)
    const defaultAvailable = data !== undefined && type !== 'file'
    const defaultValue = defaultAvailable ? data[name] : undefined

    return (
      <section
        className={`flex flex-col gap-1 p-1 ${
          span === true ? 'col-span-2' : ''
        }`}
      >
        <label
          className='line-clamp-1 cursor-pointer rounded-md bg-skyblue px-2 py-1 font-bold text-dark-200'
          htmlFor={id}
        >
          {label}
        </label>
        {isTextArea !== true ? (
          <input
            id={id}
            name={name}
            className={`rounded-md px-2 py-1 text-dark-200 ${
              type === 'file' ? 'bg-light-200' : ''
            }`}
            type={type}
            defaultValue={defaultValue}
            onChange={setChange}
          />
        ) : (
          <textarea
            id={id}
            name={name}
            className='rounded-md px-2 py-1 text-dark-200'
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
