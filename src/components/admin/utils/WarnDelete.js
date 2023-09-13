import PropTypes from 'prop-types'
import { closeModal } from '@/components/global/Modal'

export default function WarnDelete({ wish, runDelete }) {
  return (
    <section
      className='df fdc bcDp crDs pgL gpL'
      style={{
        borderBottomLeftRadius: 'var(--remS)',
        borderBottomRightRadius: 'var(--remS)'
      }}
      onClick={e => e.stopPropagation()}
    >
      <p>Seguro que desea {wish}, esta acción es irreversible.</p>
      <div className='df jcc gpL'>
        <button className='bcP crDs pgL brS cp' onClick={closeModal}>
          Cancelar
        </button>
        <button className='bcDr pgL brS cp' onClick={runDelete}>
          Si, eliminar
        </button>
      </div>
    </section>
  )
}

WarnDelete.propTypes = {
  wish: PropTypes.string.isRequired,
  runDelete: PropTypes.func.isRequired
}
