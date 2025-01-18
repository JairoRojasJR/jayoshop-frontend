import { createPortal } from 'react-dom'
import { ModalBackdrop, useModalContext } from '@/context/Modal'
import ViewInsertProvider, { useViewInsertContext } from '@/context/ViewInsert'
import useEditing from '@/hooks/editing'
import useAwaiting from '@/hooks/awaiting'
import { CustomForm } from '@/components/CustomForm'
import { Awaiting } from '@/components/Shorts'
import Edit from '@/svg/Edit'
import Trash from '@/svg/Trash'
import { jtoastAsync } from '@/lib/local'
import type { UpdatedFromInventory, DeletedFromInventory } from '@/types/server'
import { type TypingMainInputsEvent } from '@/types/local'
import style from '@/css/Inventory.module.css'
import modalStyle from '@/css/Modal.module.css'

// ========================= CardAside =========================
type AsideCardProps = {
  children: React.ReactNode
  multiSelect: boolean
}

export function AsideCard({
  children,
  multiSelect
}: AsideCardProps): JSX.Element {
  return (
    <aside
      className={`${style.admin__options} ${multiSelect ? style['admin__options-hidden'] : ''}`.trim()}
    >
      <ViewInsertProvider>
        <CardAction action='edit' icon={<Edit />}>
          {Array.isArray(children) && children[0]}
        </CardAction>
      </ViewInsertProvider>
      <ViewInsertProvider>
        <CardAction action='trash' icon={<Trash />}>
          {Array.isArray(children) && children[1]}
        </CardAction>
      </ViewInsertProvider>
    </aside>
  )
}

// ========================= CardAction =========================
type CardActionProps = {
  children: React.ReactNode
  action: 'edit' | 'trash'
  icon: JSX.Element
}

export function CardAction({
  children,
  action,
  icon
}: CardActionProps): JSX.Element {
  const { $content } = useModalContext()
  const { insert, opening } = useViewInsertContext()

  return (
    <span
      className={`${style.admin__option} admin__option-${action}`}
      onClick={opening}
    >
      {icon}
      {insert && $content !== null && createPortal(children, $content)}
    </span>
  )
}

// ========================= Editing =========================
type Props<T> = {
  data: T
  _id: string
  target: string
  runTrash: (
    _id: string,
    closing: () => void
  ) => Promise<DeletedFromInventory<T>>
  runUpdate: (formData: FormData) => Promise<UpdatedFromInventory<T>>
  Card: (props: {
    children?: React.ReactNode
    data: T
    administrable?: boolean
    compare?: T
    separator?: boolean
    selectable?: boolean
    simple?: boolean
  }) => JSX.Element
  Fields: (props: {
    data?: Omit<T, '_id'>
    typing?: ((e: TypingMainInputsEvent) => void) | undefined
  }) => JSX.Element
}

export function Editing<T>({
  data,
  _id,
  target,
  runUpdate,
  Card,
  Fields
}: Omit<Props<T>, 'runTrash'>): JSX.Element {
  const {
    awaiting,
    updated,
    closingOnChanges,
    backdrop,
    update,
    typing,
    hiddenWarn,
    closing
  } = useEditing({ data, target, runUpdate })

  return (
    <>
      <ModalBackdrop closing={backdrop} />
      <Awaiting awaiting={awaiting} />
      <Card data={updated} compare={data} separator={true} simple={true} />
      <CustomForm title='Editar' onSubmit={update} goal='Actualizar' _id={_id}>
        <Fields data={data} typing={typing} />
      </CustomForm>
      {closingOnChanges && (
        <div
          className={modalStyle.modal__closing__onchanges}
          onClick={e => e.stopPropagation()}
        >
          <article className={modalStyle.modal__closing__card}>
            <p>Hay cambios sin guardar, ¿seguro que desea continuar?</p>
            <div className={modalStyle.modal__closing__buttons}>
              <button
                className={`${modalStyle.modal__closing__button} ${modalStyle['modal__closing__button-cancel']}`}
                onClick={hiddenWarn}
              >
                Cancelar
              </button>
              <button
                className={`${modalStyle.modal__closing__button} ${modalStyle['modal__closing__button-accept']}`}
                onClick={closing}
              >
                Si, cerrar
              </button>
            </div>
          </article>
        </div>
      )}
    </>
  )
}

// ========================= Trasing =========================
export function Trashing<T>({
  data,
  _id,
  target,
  runTrash,
  Card
}: Omit<Props<T>, 'runUpdate' | 'Fields'>): JSX.Element {
  const { closing } = useViewInsertContext()
  const { awaiting, enable, disable } = useAwaiting()

  const trash = async (): Promise<void> => {
    disable()
    jtoastAsync(
      `Eliminando ${target}...`,
      async () => await runTrash(_id, closing),
      enable
    )
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <ModalBackdrop closing={closing} />
      <Awaiting awaiting={awaiting} />
      <Card data={data} separator={true} simple={true} />
      <section className='flex flex-col gap-4 rounded-md bg-dark-200 p-4 text-light-200'>
        <p>
          Seguro que desea eliminar ({target}) del inventario, esta acción es
          irreversible.
        </p>
        <div className='flex justify-center gap-4'>
          <button
            className='cursor-pointer rounded-md bg-light-100 p-4 text-dark-200 dark:bg-dark-200 dark:text-light-200'
            onClick={closing}
          >
            Cancelar
          </button>
          <button
            className='cursor-pointer rounded-md bg-danger p-4'
            onClick={trash}
          >
            Si, eliminar
          </button>
        </div>
      </section>
    </div>
  )
}
