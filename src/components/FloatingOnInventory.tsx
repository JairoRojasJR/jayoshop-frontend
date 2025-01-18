'use client'
import { createPortal } from 'react-dom'
import { ModalBackdrop, useModalContext } from '@/context/Modal'
import ViewInsertProvider, { useViewInsertContext } from '@/context/ViewInsert'
import useAwaiting from '@/hooks/awaiting'
import { Awaiting, ConfirmDel } from '@/components/Shorts'
import { CustomForm } from '@/components/CustomForm'
import { jtoast } from '@/packages/jtoast/Jtoast'
import CubePlus from '@/svg/CubePlus'
import Icon from '@/svg/MultiSelect'
import { jtoastAsync } from '@/lib/local'
import { IS_PROD_MODE } from '@/app/consts'
import type {
  AddedToInventory,
  DeletedFromInventory,
  PickId
} from '@/types/server'
import style from '@/css/Inventory.module.css'
import modalStyle from '@/css/Modal.module.css'

// ========================= FloatingOnInventory =========================
export type Props<T> = {
  target: string
  data?: Omit<T, '_id'>
  usePageContext: () => {
    current: Array<T & { _id: string }>
    multiSelect: boolean
    selecteds: string[]
    toggleMultiSelect: () => void
    printDelete: (_id: string | string[]) => void
    printAdd: (added: T) => void
  }
  Card: (props: {
    data: T
    selectable?: boolean
    simple?: boolean
  }) => JSX.Element
  Fields: (props: { data: Omit<T, '_id'> | undefined }) => JSX.Element
  runDelete: (selecteds: PickId[]) => Promise<DeletedFromInventory<T>>
  runAdd: (formData: FormData) => Promise<AddedToInventory<T>>
}

export default function FloatingOnInventory<T>({
  target,
  data,
  usePageContext,
  Card,
  Fields,
  runDelete,
  runAdd
}: Props<T>): JSX.Element {
  return (
    <div className={style.bottom__floating}>
      <ViewInsertProvider>
        <MultiSelect
          usePageContext={usePageContext}
          Card={Card}
          target={target}
          runDelete={runDelete}
        />
      </ViewInsertProvider>
      <ViewInsertProvider>
        <Add
          target={target}
          data={data}
          usePageContext={usePageContext}
          Fields={Fields}
          runAdd={runAdd}
        />
      </ViewInsertProvider>
    </div>
  )
}

// ========================= MultiSelect =========================
function MultiSelect<T>({
  target,
  usePageContext,
  Card,
  runDelete
}: Omit<Props<T>, 'runAdd' | 'Fields'>): JSX.Element {
  const { $content } = useModalContext()
  const { current, multiSelect, selecteds, toggleMultiSelect, printDelete } =
    usePageContext()
  const { insert, opening, closing } = useViewInsertContext()
  const { awaiting, enable, disable } = useAwaiting()

  const trash = (): void => {
    disable()
    const toDelete = selecteds.map(selected => ({ _id: selected }))
    const callback = async (): Promise<DeletedFromInventory<T>> => {
      const res = await runDelete(toDelete)
      closing()
      printDelete(selecteds)
      return res
    }

    jtoastAsync(`Eliminando ${target}...`, callback, enable)
  }

  return (
    <>
      <Icon
        className={`${style.bottom__floating__icon} ${style.multi__select} ${multiSelect ? style['multi__select-checked'] : ''}`.trim()}
        onClick={toggleMultiSelect}
      />
      <div
        className={`${style.multi__select__background} ${multiSelect ? style['multi__select__background-show'] : ''}`.trim()}
      >
        <button
          className={`${style.multi__select__del__bottom}`.trim()}
          style={selecteds.length < 2 ? { filter: 'grayscale(.7)' } : undefined}
          onClick={
            selecteds.length > 1
              ? opening
              : () => jtoast('Seleccione al menos 2 elementos')
          }
        >
          Eliminar
        </button>
      </div>
      {insert &&
        $content !== null &&
        createPortal(
          <div
            className={`${modalStyle.modal__content__container} ${style.multi__trash__container}`.trim()}
          >
            <ModalBackdrop closing={closing} />
            <Awaiting awaiting={awaiting} />
            <div className={style.multi__trash__items__container}>
              {current.map(
                product =>
                  selecteds.includes(product._id) && (
                    <Card
                      key={`MultiSelect-${product._id}`}
                      data={product}
                      simple={true}
                    />
                  )
              )}
            </div>
            <ConfirmDel
              target='estos productos'
              separator={true}
              trash={trash}
            />
          </div>,
          $content
        )}
    </>
  )
}

// ========================= Add =========================
function Add<T>({
  target,
  data,
  usePageContext,
  Fields,
  runAdd
}: Omit<Props<T>, 'runDelete' | 'Card'>): JSX.Element {
  const { $content } = useModalContext()
  const { printAdd } = usePageContext()
  const { insert, opening, closing } = useViewInsertContext()
  const { awaiting, enable, disable } = useAwaiting()

  const add = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    disable()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const callback = async (): Promise<AddedToInventory<T>> => {
      const res = await runAdd(formData)
      if (IS_PROD_MODE) form.reset()
      printAdd(res.added)
      return res
    }

    jtoastAsync(`Agregando ${target}...`, callback, enable)
  }

  return (
    <>
      <CubePlus
        className={`${style.bottom__floating__icon} ${style.add__item}`}
        onClick={opening}
      />
      {insert &&
        $content !== null &&
        createPortal(
          <div>
            <ModalBackdrop closing={closing} />
            <Awaiting awaiting={awaiting} />
            <CustomForm
              title={`Nuevo ${target}`}
              onSubmit={add}
              goal={`Agregar ${target}`}
            >
              <Fields data={data} />
            </CustomForm>
          </div>,
          $content
        )}
    </>
  )
}
