import { closeModal } from '@/components/global/Modal'

type Props = {
  setWarnUnsaved: (status: boolean) => void
}

export default function WarnUnsaved({ setWarnUnsaved }: Props): JSX.Element {
  return (
    <span
      className='absolute flex size-full items-center justify-center p-4'
      style={{ zIndex: 100 }}
    >
      <div
        className='absolute size-full bg-dark-100'
        style={{ opacity: '.8' }}
      />
      <section className='relative flex flex-col gap-4  rounded-md bg-light-200 p-4 text-dark-200 dark:bg-dark-200 dark:text-light-200'>
        <p>Hay cambios sin guardar, ¿seguro que desea continuar?</p>
        <div className='flex justify-center gap-4'>
          <button
            className='cursor-pointer rounded-md bg-light-100 p-4 text-dark-200 dark:bg-dark-200 dark:text-light-200'
            onClick={() => {
              setWarnUnsaved(false)
            }}
          >
            Cancelar
          </button>
          <button
            className='cursor-pointer rounded-md bg-danger p-4'
            onClick={() => {
              closeModal()
            }}
          >
            Si, cerrar
          </button>
        </div>
      </section>
    </span>
  )
}
