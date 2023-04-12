import PropTypes from 'prop-types'
import styles from '@/styles/utils/CustomForm.module.css'

export default function CustomForm({ children, formData }) {
  const { hiddenId, title, goal, runSubmit } = formData

  return (
    <form
      className={styles.customForm}
      encType='multipart/form-data'
      onClick={e => e.stopPropagation()}
      onSubmit={runSubmit}
    >
      <div className={`${styles.customFormDiv} dg bcDp crDs pgM brS`}>
        {hiddenId ? (
          <input name='_id' hidden={true} defaultValue={hiddenId} />
        ) : null}
        <section className={`${styles.gcS2} df jcfe`}>
          <h3 style={{ borderBottom: 'var(--remS) solid var(--turquoise' }}>
            {title}
          </h3>
        </section>
        {children}
        {goal ? (
          <section className={`${styles.gcS2} df jcc`}>
            <input className='cp bcTurq crDp' type='submit' value={goal} />
          </section>
        ) : null}
      </div>
    </form>
  )
}

CustomForm.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  formData: PropTypes.object.isRequired
}
