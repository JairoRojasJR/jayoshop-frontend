import { jtoast } from '@/components/jtoast';

export const openModal = (e, adminOp, setAdminOp, product) => {
  e.stopPropagation();
  const preAdminOp = { ...adminOp };
  if (adminOp.productInAction.length === 0 && adminOp.multipleCheck)
    return jtoast('👇 Seleccione al menos un producto', {
      duration: 3000,
    });

  const modal = document.getElementById('modalInventario');

  if (product) preAdminOp.productInAction = [product];
  preAdminOp.modalStatus = 'open';
  setAdminOp(preAdminOp);

  document.body.classList.add('no-scroll');
  modal.style.display = 'flex';
  setTimeout(() => (modal.style.opacity = '1'), 1);
};
