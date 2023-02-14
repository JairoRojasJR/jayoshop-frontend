import styles from '@/styles/admin/Inventory.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nanoid } from 'nanoid';
import { jtoast } from '@/components/jtoast';
import getAdminActions from '.';

export default function ActionsAdmin({ adminOp, setAdminOp }) {
  const actionsAdmin = getAdminActions({ adminOp, setAdminOp });

  const hiddeBtnReady = action => {
    const btnReady = document.querySelector(`.${styles.ready}`);
    const btnRunMultipleCheck = document.querySelector(
      `.${styles.btnRunMultipleCheck}`
    );
    const timeAwait = 300;

    if (action === 'multipleCheck' && !adminOp.multipleCheck) {
      btnRunMultipleCheck.style.display = 'block';
      setTimeout(() => (btnReady.style.top = '0'), 1);
      return timeAwait;
    } else if (
      (action === 'multipleCheck' && adminOp.multipleCheck) ||
      (action !== 'multipleCheck' && adminOp.multipleCheck)
    ) {
      btnReady.style.top = '100%';
      setTimeout(() => (btnRunMultipleCheck.style.display = 'none'), timeAwait);
      return timeAwait;
    }
    return null;
  };

  const setActionAdmin = action => {
    const preAdminOp = { ...adminOp };
    let notification;
    const msgIndex = actionsAdmin.findIndex(element => element.name === action);
    const msg = actionsAdmin[msgIndex].msg;

    if (action === 'multipleCheck') {
      if (adminOp.action[0] !== 'trash')
        return jtoast('💔 Función solo disponible con papelera', {
          duration: 3000,
        });
      else {
        if (preAdminOp.multipleCheck === true) {
          preAdminOp.multipleCheck = false;
          notification = '🚫 Selección multiple desactivada';
        } else {
          notification = '👇 Seleccione los productos a eliminar';
          preAdminOp.multipleCheck = true;
        }
      }
    } else {
      preAdminOp.multipleCheck = false;
      if (preAdminOp.action[0] === action) {
        preAdminOp.action = [];
        notification = `🚫 Función ${action} deshabilitada`;
      } else {
        notification = `${msg}`;
        preAdminOp.action = [action];
      }
    }
    preAdminOp.productInAction = [];
    jtoast(notification, { duration: 3000 });

    const timeAwait = hiddeBtnReady(action);
    if (timeAwait) return setTimeout(() => setAdminOp(preAdminOp), timeAwait);
    return setAdminOp(preAdminOp);
  };

  return (
    <section className={`${styles.actionsContainer} df jcse`}>
      {actionsAdmin.map(action => {
        return (
          <article
            key={nanoid(10)}
            className={`${styles.action} df jcc cp pr`}
            onClick={() => setActionAdmin(action.name)}
            style={{
              opacity:
                adminOp.action[0] === action.name ||
                adminOp[action.name] === true
                  ? '1'
                  : '0.8',
            }}
          >
            {action.children ? action.children : ''}
            {action.icon.map(icon => (
              <FontAwesomeIcon key={nanoid(10)} icon={icon} />
            ))}
          </article>
        );
      })}
    </section>
  );
}
