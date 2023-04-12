import PropTypes from 'prop-types'
import CustomForm from '@/components/utils/CustomForm'
import FieldsProduct from '@/components/admin/utils/FieldsProduct'
import { getDevDataProduct } from '@/services/publicInventory'
import { addProduct } from '@/services/adminInventory'
import { jtoast } from '@/packages/jtoast/Jtoast'

export default function NewProduct({ reloadProducts }) {
  const sendNewProduct = async e => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const res = await addProduct(formData)
    if (res.error) return jtoast(res.error)
    form.reset()
    jtoast(res.message)
    reloadProducts()
  }

  return (
    <CustomForm
      formData={{
        title: 'Nuevo Producto',
        runSubmit: sendNewProduct,
        goal: 'Agregar producto'
      }}
    >
      <FieldsProduct data={getDevDataProduct()} />
    </CustomForm>
  )
}

NewProduct.propTypes = {
  reloadProducts: PropTypes.func.isRequired
}
