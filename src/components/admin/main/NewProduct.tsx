import CustomForm from '@/components/utils/CustomForm'
import FieldsProduct from '@/components/admin/utils/FieldsProduct'
import { getDevDataProduct, addProduct } from '@/services/admin/inventory'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { type OnSuccesServer } from '@/types'

type Props = {
  reloadProducts: OnSuccesServer
}

export default function NewProduct({ reloadProducts }: Props): JSX.Element {
  const sendNewProduct = async (
    e: React.FormEvent<SubmitEvent>
  ): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const res = await addProduct(formData)
    if (res.error !== undefined) {
      jtoast(res.error)
    } else if (res.message !== undefined) {
      if (globalThis.isProdMode) form.reset()
      jtoast(res.message)
      reloadProducts()
    }
  }

  return (
    <CustomForm
      formSources={{
        title: 'Nuevo Producto',
        runSubmit: sendNewProduct,
        goal: 'Agregar producto'
      }}
    >
      <FieldsProduct
        data={!globalThis.isProdMode ? getDevDataProduct() : undefined}
      />
    </CustomForm>
  )
}
