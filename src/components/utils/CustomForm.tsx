import type { FormSources } from '@/types'

type Props = {
  children: React.ReactNode
  formSources: FormSources
  color?: 'primary' | 'secondary'
}

export default function CustomForm({
  children,
  formSources,
  color
}: Props): JSX.Element {
  const { hiddenId, title, goal, runSubmit } = formSources ?? {}

  return (
    <form
      encType='multipart/form-data'
      onClick={e => {
        e.stopPropagation()
      }}
      onSubmit={runSubmit}
    >
      <div
        className={`grid max-h-[350px] grid-cols-2 gap-y-2 overflow-y-auto rounded-md ${
          color === 'primary' || color === undefined
            ? 'bg-light-100 p-2 dark:bg-dark-100'
            : 'bg-light-200 p-2 dark:bg-dark-200'
        }`}
        style={{ scrollbarWidth: 'thin' }}
      >
        {hiddenId !== undefined ? (
          <input name='_id' hidden={true} defaultValue={hiddenId} />
        ) : null}
        <section className='col-span-2 flex justify-end px-1'>
          <h3 className='border-b-2 border-solid border-turquoise text-dark-200 dark:text-light-200'>
            {title}
          </h3>
        </section>
        {children}
        {goal !== undefined ? (
          <section className='col-span-2 flex justify-center px-1'>
            <input
              className='cursor-pointer rounded-md bg-turquoise p-2 text-dark-200'
              type='submit'
              value={goal}
            />
          </section>
        ) : null}
      </div>
    </form>
  )
}
