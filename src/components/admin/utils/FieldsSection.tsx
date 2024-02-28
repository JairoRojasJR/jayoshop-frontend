import { nanoid } from 'nanoid'

type Props = { data?: { name: string | undefined }; setChange?: () => void }

export default function FieldsSection({ data, setChange }: Props): JSX.Element {
  const { name } = data ?? {}
  return (
    <>
      <section className='col-span-2 flex flex-col gap-1 p-1'>
        <label
          className='line-clamp-1 cursor-pointer rounded-md bg-skyblue px-2 py-1 font-bold text-dark-200'
          htmlFor={`nameSection${nanoid(5)}`}
        >
          Nombre
        </label>
        <input
          id={`nameSection${nanoid(5)}`}
          className='rounded-md px-2 py-1 text-dark-200 '
          name='name'
          defaultValue={name}
          onChange={setChange}
        />
      </section>
      <section className='col-span-2 flex flex-col gap-1 p-1'>
        <label
          className='line-clamp-1 cursor-pointer rounded-md bg-skyblue px-2 py-1 font-bold text-dark-200'
          htmlFor={`imageSection${nanoid(5)}`}
        >
          Imagen
        </label>
        <input
          id={`imageSection${nanoid(5)}`}
          className='rounded-md bg-light-200 px-2 py-1'
          name='image'
          type='file'
          onChange={setChange}
        />
      </section>
    </>
  )
}
