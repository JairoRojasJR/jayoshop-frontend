import PropTypes from 'prop-types'
import CustomForm from '@/components/utils/CustomForm'
import FieldsProduct from '@/components/admin/utils/FieldsProduct'
import { getDevDataProduct, addProduct } from '@/services/admin/inventory'
import { jtoast } from '@/packages/jtoast/Jtoast'

export default function NewProduct({ reloadProducts }) {
  const sendNewProduct = async e => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const res = await addProduct(formData)
    if (res.error) return jtoast(res.error)
    if (globalThis.isProdMode) form.reset()
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
      <FieldsProduct
        data={!globalThis.isProdMode ? getDevDataProduct() : null}
      />
    </CustomForm>
  )
}

NewProduct.propTypes = {
  reloadProducts: PropTypes.func.isRequired
}
