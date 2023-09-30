import { useState } from 'react'
import { useRouter } from 'next/router'
import CustomForm from '@/components/utils/CustomForm'
import Actions from '@/components/admin/main/Actions'
import Edit from '@/components/admin/main/Edit'
import Trash, { runMultiTrash, MultiTrash } from '@/components/admin/main/Trash'
import SectionCard from '@/components/utils/CardSection'
import FieldsSection from '@/components/admin/utils/FieldsSection'
import { openModal } from '@/components/global/Modal'
import {
  addSection,
  updateSection,
  deleteSection,
  handleRes
} from '@/services/admin/inventory'
import { nanoid } from 'nanoid'
import type { AdminAction, OnSuccesServer, Section, Toggle } from '@/types'

type Props = {
  sections: Section[]
  reloadSections: OnSuccesServer
  reloadProducts: OnSuccesServer
}

export default function Sections({
  sections,
  reloadSections,
  reloadProducts
}: Props): JSX.Element {
  const [action, setAction] = useState<AdminAction>('')
  const [selecteds, setSelecteds] = useState<Section[]>([])
  const router = useRouter()

  const updateActionSelected = (
    updated: AdminAction,
    resetSelecteds: Toggle
  ): void => {
    setAction(updated)
    if (resetSelecteds === 1) setSelecteds([])
  }

  type FormSubmit = React.FormEvent<SubmitEvent>
  const sendNewSection = async (e: FormSubmit): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const res = await addSection(formData)
    handleRes(res, () => {
      if (globalThis.isProdMode) form.reset()
      reloadSections()
    })
  }

  const runMultiTrashAction = (e: React.MouseEvent): void => {
    e.preventDefault()
    const reload = (): void => {
      const currentSection = router.query?.section
      const requireUpdate = selecteds.find(
        section => currentSection === section.name
      )

      reloadProducts()
      reloadSections()
      setSelecteds([])
      if (requireUpdate !== undefined) {
        router.push('/admin/inventario').catch((e: Error) => {
          console.log(e.message)
        })
      }
    }

    const Component = (
      <MultiTrash
        Card={SectionCard}
        items={selecteds}
        wish='eliminar estas secciones'
        target='section'
        send={deleteSection}
        onSuccess={reload}
      />
    )

    runMultiTrash(selecteds.length > 1, Component)
  }

  const switchSelected = (section: Section): void => {
    const preSelecteds = [...selecteds]
    const index = preSelecteds.findIndex(
      selected => selected._id === section._id
    )

    if (index === -1) preSelecteds.push(section)
    else preSelecteds.splice(index, 1)

    setSelecteds(preSelecteds)
  }

  type ClickEvent = React.MouseEvent<HTMLButtonElement>
  const runSwitchSection = (e: ClickEvent, section: Section): void => {
    e.preventDefault()
    const requireChangeSection = (): void => {
      const currentSection = router.query?.section
      const requireUpdate = currentSection === section.name
      reloadSections()
      if (requireUpdate)
        router.push('/admin/inventario').catch((e: Error) => {
          console.log(e.message)
        })
    }

    let Component
    if (action === 'multieliminar') {
      switchSelected(section)
      return
    } else if (action === 'editar') {
      Component = (
        <Edit
          Card={SectionCard}
          Fields={FieldsSection}
          data={section}
          send={updateSection}
          onSuccess={requireChangeSection}
        />
      )
    } else if (action === 'eliminar') {
      Component = (
        <Trash
          Card={SectionCard}
          data={section}
          wish='eliminar esta sección del inventario'
          send={deleteSection}
          onSuccess={requireChangeSection}
        />
      )
    } else return
    openModal({ Component })
  }

  // Componentes required
  type SwitchSectionProps = { section: Section }

  function SwitchSection({ section }: SwitchSectionProps): JSX.Element {
    const { _id, name } = section

    let className = 'w100p df bcDs crDp pgM brS owH jcc'
    let style
    if (action.length > 0) className += ' cp'

    const index = selecteds.findIndex(selected => selected._id === _id)
    if (index !== -1) style = { background: 'var(--danger)' }

    return (
      <button
        className={className}
        style={style}
        onClick={e => {
          runSwitchSection(e, section)
        }}
      >
        {name}
      </button>
    )
  }

  return (
    <div className='df fdc gpM'>
      <CustomForm
        formSources={{
          title: 'Nueva Sección',
          runSubmit: sendNewSection,
          goal: 'Agregar sección'
        }}
      >
        <FieldsSection
          data={{ name: !globalThis.isProdMode ? 'Lacteos' : undefined }}
        />
      </CustomForm>
      <div style={{ marginTop: 'var(--remL)' }}>
        <section className='pr spanC2' style={{ zIndex: 100 }}>
          <Actions
            selected={action}
            updateSelected={updateActionSelected}
            isMultiTrashReady={selecteds.length > 1}
            runMultiTrash={runMultiTrashAction}
          />
        </section>
        <CustomForm formSources={{ title: 'Secciones' }}>
          <section className='sectionsContianer dg gpM'>
            {sections.map(section => (
              <SwitchSection key={nanoid(5)} section={section} />
            ))}
          </section>
        </CustomForm>
      </div>
      <style jsx>{`
        .sectionsContianer {
          grid-column: span 2;
          grid-template-columns: repeat(2, 1fr);
        }
      `}</style>
    </div>
  )
}
