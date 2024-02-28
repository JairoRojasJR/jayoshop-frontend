'use client'

import { type ChangeEvent, useState } from 'react'
import { Modaldiv, closeModal } from '@/components/global/Modal'
import CustomForm from '@/components/utils/CustomForm'
import WarnUnsaved from '@/components/admin/utils/WarnUnsaved'
import { jtoast } from '@/packages/jtoast/Jtoast'
import type {
  Product,
  OnSuccesServer,
  SendProduct,
  SendSection,
  Section
} from '@/types'
import { handleRes } from '@/services/admin/inventory'

type Props = {
  Card: React.ElementType
  data: Product | Section
  Fields: React.ElementType
  send: SendProduct | SendSection
  onSuccess: OnSuccesServer
}

export default function Edit({
  Card,
  data,
  Fields,
  send,
  onSuccess
}: Props): JSX.Element {
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

  const setChange = (e: React.FormEvent<ChangeEvent>): void => {
    const prePreview = Object.seal({ ...preview })
    const preUpdated = Object.seal({ ...updated })
    const inputHtml = e.target as HTMLFormElement
    const field = inputHtml.name
    const isFile = inputHtml.files !== null && inputHtml.files !== undefined
    const file = isFile ? inputHtml.files[0] : null

    let currentValue: string
    if (file !== null) {
      const fileNameInAction = data.image
      const fileName = file.name
      let imageNameInAction = fileNameInAction.split(/--id--[\w]+\./)[0]
      imageNameInAction = imageNameInAction.split('/')[1]
      const imageInputName = fileName.split('.')[0]
      if (imageNameInAction === imageInputName) currentValue = fileNameInAction
      else currentValue = file.name
    } else currentValue = inputHtml.value

    const initialValue = Object.entries(data).find(entries => {
      return entries[0] === field
    })

    if (initialValue === undefined) {
      throw new Error('Sucedió un error al detectar los cambios')
    }

    if (currentValue !== initialValue[1]) {
      Object.assign(preUpdated, { [field]: true })
    } else Object.assign(preUpdated, { [field]: false })

    if (file !== null) {
      const url = URL.createObjectURL(file as File)
      Object.assign(prePreview, { [field]: url })
    } else Object.assign(prePreview, { [field]: currentValue })

    setUpdated(preUpdated)
    setPreview(prePreview)
  }

  const verifyUnsaved = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation()
    const entries = Object.entries(updated)
    const isUpdated = entries.find(field => field[1])
    if (isUpdated !== undefined) {
      setWarnUnsaved(true)
      return
    }
    closeModal()
  }

  const sendUpdated = async (
    e: React.FormEvent<SubmitEvent>
  ): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    Object.keys(preview).map(field => {
      const isUpdated = Object.entries(updated).find(fieldUpdated => {
        return fieldUpdated[0] === field && fieldUpdated[1]
      })

      if (isUpdated === undefined && field !== '_id') {
        formData.delete(field)
        return undefined
      }
      return false
    })

    const fromEntries = Object.fromEntries(formData)
    const keys = Object.keys(fromEntries)
    if (fromEntries._id === undefined) throw new Error('Missing field _id')
    if (keys.length === 1) {
      jtoast('No se detectó ningún cambio')
      return
    }

    const res = await send(formData)
    handleRes(res, onSuccess)
  }

  return (
    <Modaldiv beforeClose={verifyUnsaved}>
      <div className='mx-auto flex h-full max-w-[350px] flex-col'>
        <section>
          <Card
            data={preview}
            updated={updated}
            showSection={true}
            color='dark'
          />
        </section>
        <section>
          <CustomForm
            formSources={{
              title: 'Edición',
              hiddenId: data._id,
              goal: 'Confirmar cambios',
              runSubmit: sendUpdated
            }}
            color='secondary'
          >
            <Fields data={data} setChange={setChange} />
          </CustomForm>
        </section>
        {warnUnsaved ? <WarnUnsaved setWarnUnsaved={setWarnUnsaved} /> : null}
      </div>
    </Modaldiv>
  )
}
