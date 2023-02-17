import { readyContainer, ready } from '@/styles/admin/Inventory.module.css';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { openModal } from '@/services/openModalActions';
import { jtoast } from '@/components/jtoast';

export default function getAdminActions({ adminOp, setAdminOp, selecteds }) {
  const selectedsArray = Object.entries(selecteds);

  const isNotReady = selectedsArray?.length === 0;
  const stylesReadyContainer = isNotReady ? { display: 'flex' } : {};
  let stylesReady = adminOp.multipleCheck ? { top: '0' } : { top: '100%' };
  if (isNotReady) stylesReady.filter = 'grayscale(.7)';

  const runReady = () => {
    if (isNotReady)
      return jtoast('👇 Seleccione al menos un producto', {
        duration: 3000,
      });
    openModal({ adminOp, setAdminOp });
  };

  const readyMultipleCheck = (
    <div
      className={`${readyContainer} pa`}
      onClick={e => e.stopPropagation()}
      style={stylesReadyContainer}
    >
      <button
        onClick={runReady}
        className={`${ready} ${!isNotReady ? 'cp' : ''} pr`}
        style={stylesReady}
      >
        LISTO
      </button>
    </div>
  );

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
      children: readyMultipleCheck,
    },
    {
      name: 'multipleCheck',
      icon: [solid('square-check'), solid('square-check')],
      icons: 2,
      msg: 'Ahora puede seleccionar multiples productos',
    },
  ];
}
