export const closeModal = (adminOp, setAdminOp) => {
  if (adminOp.modalStatus !== 'close') {
    const preAdminOp = { ...adminOp };
    const modal = document.getElementById('modalInventario');
    preAdminOp.modalStatus = 'close';
    preAdminOp.productInAction = [];

    document.body.classList.remove('no-scroll');
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      setAdminOp(preAdminOp);
    }, 300);
  }
};
