import PropTypes from 'prop-types'
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
  deleteSection
} from '@/services/adminInventory'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'

export default function Sections({ sections, reloadSections, reloadProducts }) {
  const [action, setAction] = useState('')
  const [selecteds, setSelecteds] = useState([])
  const router = useRouter()

  const updateActionSelected = (updated, resetSelecteds) => {
    setAction(updated)
    if (resetSelecteds) setSelecteds([])
  }

  const sendNewSection = async e => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const res = await addSection(formData)
    if (res.error) return jtoast(res.error)
    form.reset()
    jtoast(res.message)
    reloadSections()
  }

  const runMultiTrashAction = e => {
    e.preventDefault()
    const reload = () => {
      const currentSection = router.query?.section
      const finding = section => currentSection === section.name
      const requireUpdate = selecteds.find(finding)

      reloadProducts()
      reloadSections()
      setSelecteds([])
      if (requireUpdate) router.push('/admin/inventario')
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

  const switchSelected = section => {
    const preSelecteds = [...selecteds]
    const finding = selected => selected._id === section._id
    const index = preSelecteds.findIndex(finding)

    if (index === -1) preSelecteds.push(section)
    else preSelecteds.splice(index, 1)

    setSelecteds(preSelecteds)
  }

  const runSwitchSection = (e, section) => {
    e.preventDefault()
    const requireChangeSection = () => {
      const currentSection = router.query?.section
      const requireUpdate = currentSection === section.name
      reloadSections()
      if (requireUpdate) router.push('/admin/inventario')
    }

    let Component
    if (action === 'multiEliminar') return switchSelected(section)
    else if (action === 'editar') {
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
  function SwitchSection({ section }) {
    const { _id, name } = section

    let className = 'w100p df bcDs crDp pgM brS owH jcc'
    let style
    if (action) className += ' cp'

    const finding = selected => selected._id === _id
    const index = selecteds.findIndex(finding)
    if (index !== -1) style = { background: 'var(--danger)' }

    return (
      <button
        className={className}
        style={style}
        onClick={e => runSwitchSection(e, section)}
      >
        {name}
      </button>
    )
  }

  SwitchSection.propTypes = { section: PropTypes.object.isRequired }

  return (
    <div className='df fdc gpM'>
      <CustomForm
        formData={{
          title: 'Nueva Sección',
          runSubmit: sendNewSection,
          goal: 'Agregar sección'
        }}
      >
        <FieldsSection
          data={{ name: globalThis.mode === 'dev' ? 'Lacteos' : null }}
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
        <CustomForm formData={{ title: 'Secciones' }}>
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

Sections.propTypes = {
  sections: PropTypes.array.isRequired,
  reloadSections: PropTypes.func.isRequired,
  reloadProducts: PropTypes.func.isRequired
}
