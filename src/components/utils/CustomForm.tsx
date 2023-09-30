import styles from '@/styles/utils/CustomForm.module.css'
import type { FormSources } from '@/types'

type Props = {
  children: React.ReactNode
  formSources: FormSources
}

export default function CustomForm({
  children,
  formSources
}: Props): JSX.Element {
  const { hiddenId, title, goal, runSubmit } = formSources ?? {}

  return (
    <form
      className={styles.customForm}
      encType='multipart/form-data'
      onClick={e => {
        e.stopPropagation()
      }}
      onSubmit={runSubmit}
    >
      <div className={`${styles.customFormDiv} dg bcDp pgM brS`}>
        {hiddenId !== undefined ? (
          <input name='_id' hidden={true} defaultValue={hiddenId} />
        ) : null}
        <section className={`${styles.gcS2} df jcfe`}>
          <h3
            className='crDs'
            style={{ borderBottom: 'var(--remS) solid var(--turquoise)' }}
          >
            {title}
          </h3>
        </section>
        {children}
        {goal !== undefined ? (
          <section className={`${styles.gcS2} df jcc`}>
            <input className='cp bcTurq crDp crD' type='submit' value={goal} />
          </section>
        ) : null}
      </div>
    </form>
  )
}
