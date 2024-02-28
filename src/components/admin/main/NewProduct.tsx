import CustomForm from '@/components/utils/CustomForm'
import FieldsProduct from '@/components/admin/utils/FieldsProduct'
import { getDevDataProduct, addProduct } from '@/services/admin/inventory'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { type OnSuccesServer } from '@/types'
import { IS_PROD_MODE } from '@/app/consts'

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
      if (IS_PROD_MODE) form.reset()
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
      <FieldsProduct data={!IS_PROD_MODE ? getDevDataProduct() : undefined} />
    </CustomForm>
  )
}
