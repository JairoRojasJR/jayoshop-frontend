export const openModal = ({ adminOp, setAdminOp, product }) => {
  if (adminOp.modalStatus !== 'open') {
    const preAdminOp = { ...adminOp };
    const modal = document.getElementById('modalInventario');

    if (!adminOp.multipleCheck && product) preAdminOp.productInAction = [product];
    preAdminOp.modalStatus = 'open';
    setAdminOp(preAdminOp);

    document.body.classList.add('no-scroll');
    modal.style.display = 'flex';
    setTimeout(() => (modal.style.opacity = '1'), 1);
  }
};
