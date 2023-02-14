import styles from '@/styles/admin/Inventory.module.css';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { openModal } from '@/services/openModalActions';

export default function getAdminActions({ adminOp, setAdminOp }) {
  return [
    {
      name: 'edit',
      icon: [solid('pencil')],
      msg: '🖊 Seleccione un producto para editarlo',
    },
    {
      name: 'trash',
      icon: [solid('trash')],
      msg: '🗑 Seleccione un producto para eliminarlo',
      children: (
        <div
          className={`${styles.btnRunMultipleCheck} pa`}
          onClick={e => e.preventDefault()}
          style={
            adminOp.productInAction.length === 0
              ? {
                  filter: 'grayscale(.7)',
                  display: `${adminOp.multipleCheck ? 'flex' : 'none'}`,
                }
              : {}
          }
        >
          <button
            onClick={e => openModal(e, adminOp, setAdminOp)}
            className={`${styles.ready} pr ${
              adminOp.productInAction.length > 0 ? 'cp' : ''
            }`}
            style={adminOp.multipleCheck ? { top: '0' } : { top: '100%' }}
          >
            LISTO
          </button>
        </div>
      ),
    },
    {
      name: 'multipleCheck',
      icon: [solid('square-check'), solid('square-check')],
      icons: 2,
      msg: 'Ahora puede seleccionar multiples productos',
    },
  ];
}
