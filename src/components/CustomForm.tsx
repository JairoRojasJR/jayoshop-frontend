'use client'

import type { TypingMainInputsEvent } from '@/types/local'
import style from '@/css/CustomForm.module.css'
import type { Product, Section } from '@/types/server'
import { useProductsContext } from '@/context/Products'

// ========================= CustomForm =========================
type CustomFormProps = {
  children: React.ReactNode
  title: string
  goal: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  _id?: string
}

export function CustomForm({
  children,
  title,
  goal,
  onSubmit,
  _id
}: CustomFormProps): JSX.Element {
  return (
    <form
      className={style.custom__form}
      encType='multipart/form-data'
      onSubmit={onSubmit}
    >
      {_id !== undefined && (
        <input name='_id' hidden={true} defaultValue={_id} />
      )}
      <section className={style.custom__form__section}>
        <h3 className={style.custom__form__title}>{title}</h3>
      </section>
      {children}
      <section className={style.custom__form__section}>
        <button className={style.custom__form__button} value={goal}>
          Enviar
        </button>
      </section>
    </form>
  )
}

// ========================= Field =========================
type FieldProps = {
  label: string
  name: string
  children?: React.ReactNode
  placeholder?: string
  defaultValue?: string | undefined
  type?: string
  small?: boolean
  isTextArea?: boolean
  isSelect?: boolean
  typing?: (e: TypingMainInputsEvent) => void
}

export function Field({
  label,
  name,
  children,
  placeholder,
  defaultValue,
  type,
  small = false,
  isTextArea = false,
  isSelect = false,
  typing
}: FieldProps): JSX.Element {
  return (
    <section
      className={style.custom__form__field}
      style={{ gridColumn: !small ? 'span 2' : 'auto' }}
    >
      <label htmlFor={name}>{label}</label>
      {isSelect && (
        <select
          id={name}
          defaultValue={defaultValue}
          onChange={typing}
          name='section'
        >
          {children}
        </select>
      )}
      {!isSelect &&
        (!isTextArea ? (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={typing}
          />
        ) : (
          <textarea
            id={name}
            name='description'
            defaultValue={defaultValue}
            onChange={typing}
          />
        ))}
    </section>
  )
}

// ========================= FieldsProduct =========================
type FieldsProductProps = {
  data?: Omit<Product, '_id'>
  typing?: ((e: TypingMainInputsEvent) => void) | undefined
}

export function FieldsProduct({
  data,
  typing
}: FieldsProductProps): JSX.Element {
  const { sections } = useProductsContext()
  const { name, description, cuantity, price, section, barcode } = data ?? {}

  return (
    <>
      <Field
        label='Nombre'
        name='name'
        defaultValue={name}
        placeholder='¿Cómo se llama el producto?'
        typing={typing}
      />
      <Field
        label='Descripción'
        name='description'
        defaultValue={description}
        placeholder='Describa el producto'
        isTextArea={true}
        typing={typing}
      />
      <Field
        label='Imagen'
        name='image'
        placeholder='Describa el producto'
        type='file'
        typing={typing}
      />
      <Field
        label='Precio'
        name='price'
        defaultValue={price?.toString()}
        placeholder='¿Cuánto cuesta?'
        small={true}
        typing={typing}
      />
      <Field
        label='Cantidad'
        name='cuantity'
        defaultValue={cuantity?.toString()}
        placeholder='Stock'
        small={true}
        typing={typing}
      />
      <Field
        label='Sección'
        name='section'
        defaultValue={section}
        small={true}
        isSelect={true}
        typing={typing}
      >
        {sections.map(section => (
          <option key={crypto.randomUUID()}>{section.name}</option>
        ))}
      </Field>
      <Field
        label='Codigo de barras'
        name='barcode'
        defaultValue={barcode?.toString()}
        small={true}
        typing={typing}
      />
    </>
  )
}

// ========================= FieldsSection =========================
type FieldsSectionProps = {
  data?: Omit<Section, '_id'>
  typing?: ((e: TypingMainInputsEvent) => void) | undefined
}

export function FieldsSection({
  data,
  typing
}: FieldsSectionProps): JSX.Element {
  const { name } = data ?? {}

  return (
    <>
      <Field
        label='Nombre'
        name='name'
        defaultValue={name}
        placeholder='¿Cómo se llama la sección?'
        typing={typing}
      />
      <Field label='Imagen' name='image' type='file' typing={typing} />
    </>
  )
}
