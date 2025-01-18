'use client'

import { useProductsContext } from '@/context/Products'
import { useSectionsContext } from '@/context/Sections'
import { AsideCard, Editing, Trashing } from '@/components/Inventory'
import FloatingOnInventory from '@/components/FloatingOnInventory'
import { ProductCard, SectionCard } from '@/components/Cards'
import { FieldsProduct, FieldsSection } from '@/components/CustomForm'
import {
  addProduct,
  addSection,
  deleteProduct,
  deleteSection,
  updateProduct,
  updateSection
} from '@/services/inventory'
import { fillDataProduct, IS_PROD_MODE } from '@/app/consts'
import type {
  AddedProduct,
  AddedSection,
  DeletedProduct,
  DeletedSection,
  Product,
  Section,
  UpdatedFromInventory
} from '@/types/server'
import style from '@/css/Products.module.css'

export function Products(): JSX.Element {
  const { current, multiSelect, printUpdate, printDelete } =
    useProductsContext()

  async function runUpdate(
    formData: FormData
  ): Promise<UpdatedFromInventory<Product>> {
    const res = await updateProduct(formData)
    printUpdate(res.updated)
    return res
  }

  const runTrash = async (
    _id: string,
    closing: () => void
  ): Promise<DeletedProduct> => {
    const res = await deleteProduct({ _id })
    closing()
    printDelete(res.deleted._id)
    return res
  }

  const runDelete = async (
    toDelete: Array<{ _id: string }>
  ): Promise<DeletedProduct> => {
    return await deleteProduct(toDelete)
  }

  const runAdd = async (formData: FormData): Promise<AddedProduct> => {
    return await addProduct(formData)
  }

  return (
    <>
      <section className={style.products}>
        {current.map(product => (
          <ProductCard
            key={'ProductCardsContainer-' + product._id}
            data={product}
            administrable={true}
            selectable={true}
          >
            <AsideCard multiSelect={multiSelect}>
              <Editing
                data={product}
                _id={product._id}
                target='producto'
                Card={ProductCard}
                Fields={FieldsProduct}
                runUpdate={runUpdate}
              />
              <Trashing
                data={product}
                _id={product._id}
                target='producto'
                Card={ProductCard}
                runTrash={runTrash}
              />
            </AsideCard>
          </ProductCard>
        ))}
      </section>
      <FloatingOnInventory
        target='productos'
        data={!IS_PROD_MODE ? fillDataProduct : undefined}
        usePageContext={useProductsContext}
        Card={ProductCard}
        runDelete={runDelete}
        Fields={FieldsProduct}
        runAdd={runAdd}
      />
    </>
  )
}

export function Sections(): JSX.Element {
  const { current, multiSelect, printUpdate, printDelete } =
    useSectionsContext()

  async function runUpdate(
    formData: FormData
  ): Promise<UpdatedFromInventory<Section>> {
    const res = await updateSection(formData)
    printUpdate(res.updated)
    return res
  }

  const runTrash = async (
    _id: string,
    closing: () => void
  ): Promise<DeletedSection> => {
    const res = await deleteSection({ _id })
    closing()
    printDelete(res.deleted._id)
    return res
  }

  const runDelete = async (
    toDelete: Array<{ _id: string }>
  ): Promise<DeletedSection> => {
    return await deleteSection(toDelete)
  }

  const runAdd = async (formData: FormData): Promise<AddedSection> => {
    return await addSection(formData)
  }

  return (
    <>
      <section className={style.products}>
        {current.map(section => (
          <SectionCard
            key={'SectionCardsContainer-' + section._id}
            data={section}
            administrable={true}
            selectable={true}
          >
            <AsideCard multiSelect={multiSelect}>
              <Editing
                data={section}
                _id={section._id}
                target='sección'
                Card={SectionCard}
                Fields={FieldsSection}
                runUpdate={runUpdate}
              />
              <Trashing
                data={section}
                _id={section._id}
                target='sección'
                Card={SectionCard}
                runTrash={runTrash}
              />
            </AsideCard>
          </SectionCard>
        ))}
      </section>
      <FloatingOnInventory
        target='secciones'
        usePageContext={useSectionsContext}
        Card={SectionCard}
        Fields={FieldsSection}
        runDelete={runDelete}
        runAdd={runAdd}
      />
    </>
  )
}
