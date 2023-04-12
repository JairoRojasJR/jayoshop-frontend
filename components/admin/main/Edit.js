import PropTypes from 'prop-types'
import { useState } from 'react'
import { Modaldiv, closeModal } from '@/components/global/Modal'
import CustomForm from '@/components/utils/CustomForm'
import WarnUnsaved from '@/components/admin/utils/WarnUnsaved'
import { jtoast } from '@/packages/jtoast/Jtoast'

export default function Edit({ Card, data, Fields, send, onSuccess }) {
  const [preview, setPreview] = useState(data)
  const [warnUnsaved, setWarnUnsaved] = useState(false)
  const [updated, setUpdated] = useState({
    name: false,
    description: false,
    image: false,
    price: false,
    cuantity: false,
    section: false,
    barcode: false
  })

  const setChange = e => {
    const prePreview = { ...preview }
    const preUpdated = { ...updated }
    const inputHtml = e.target
    const field = inputHtml.name
    const file = inputHtml.files ? inputHtml.files[0] : null

    let currentValue
    if (file) {
      const fileNameInAction = data.image
      const fileName = file.name
      let imageNameInAction = fileNameInAction.split(/--id--[\w]+\./)[0]
      imageNameInAction = imageNameInAction.split('/')[1]
      const imageInputName = fileName.split('.')[0]
      if (imageNameInAction === imageInputName) currentValue = fileNameInAction
      else currentValue = file.name
    } else currentValue = inputHtml.value

    const initialValue = data[field].toString()
    if (currentValue !== initialValue) preUpdated[field] = true
    else preUpdated[field] = false

    if (file) {
      const url = URL.createObjectURL(file)
      prePreview[field] = url
    } else prePreview[field] = currentValue

    setUpdated(preUpdated)
    setPreview(prePreview)
  }

  const verifyUnsaved = e => {
    e.stopPropagation()
    const entries = Object.entries(updated)
    const isUpdated = entries.find(field => field[1] === true)
    if (isUpdated) return setWarnUnsaved(true)
    closeModal()
  }

  const sendUpdated = async e => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)

    Object.keys(preview).map(field => {
      if (!updated[field] && field !== '_id') return formData.delete(field)
      return false
    })

    const fromEntries = Object.fromEntries(formData)
    const keys = Object.keys(fromEntries)
    if (!fromEntries._id) throw new Error('Missing field _id')
    if (keys.length === 1) return jtoast('No se detectó ningún cambio')

    const res = await send(formData)
    if (res.error) return jtoast(res.error)
    jtoast(res.message)
    onSuccess()
    closeModal()
  }

  return (
    <Modaldiv beforeClose={verifyUnsaved}>
      <div className='df fdc h100p'>
        <section>
          <Card data={preview} updated={updated} showSection={true} />
        </section>
        <section className='owyA'>
          <CustomForm
            formData={{
              title: 'Edición',
              hiddenId: data._id,
              goal: 'Confirmar cambios',
              runSubmit: sendUpdated
            }}
          >
            <Fields data={data} setChange={setChange} />
          </CustomForm>
        </section>
        {warnUnsaved ? <WarnUnsaved setWarnUnsaved={setWarnUnsaved} /> : null}
      </div>
    </Modaldiv>
  )
}

Edit.propTypes = {
  Card: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  Fields: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}
