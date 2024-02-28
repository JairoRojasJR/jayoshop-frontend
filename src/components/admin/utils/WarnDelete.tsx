import { closeModal } from '@/components/global/Modal'

type Props = {
  wish: string
  runDelete: () => void
}

export default function WarnDelete({ wish, runDelete }: Props): JSX.Element {
  return (
    <section
      className='flex flex-col gap-4 rounded-b-sm bg-light-200 p-4 text-dark-200 dark:bg-dark-200 dark:text-light-200'
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <p>Seguro que desea {wish}, esta acción es irreversible.</p>
      <div className='flex justify-center gap-4'>
        <button
          className='cursor-pointer rounded-md bg-light-100 p-4 text-dark-200 dark:bg-dark-200 dark:text-light-200'
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          className='cursor-pointer rounded-md bg-danger p-4'
          onClick={runDelete}
        >
          Si, eliminar
        </button>
      </div>
    </section>
  )
}
