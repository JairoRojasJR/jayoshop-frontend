import stylesUi from '../styles/admin/Ui.module.css';
import stylesInventory from '../styles/admin/Inventory.module.css';

export const openAdminOp = ({ sourcesHtml, initialHeightAdminOp }) => {
  const { uiContainerHtml, adminOpHtml, mainHtml } = sourcesHtml;
  const navMainHtml = document.getElementById('navMain');

  adminOpHtml.current.style.top = `${navMainHtml.clientHeight}px`;
  mainHtml.current.style.marginTop = `calc(${initialHeightAdminOp}px + 1rem)`;
  uiContainerHtml.current.classList.remove(stylesUi.close);
  uiContainerHtml.current.classList.add(stylesUi.open);
};

export const closeAdminOp = ({ sourcesHtml }) => {
  const { uiContainerHtml, adminOpHtml, mainHtml } = sourcesHtml;
  const navMainHtml = document.getElementById('navMain');

  adminOpHtml.current.style.top = `${
    navMainHtml.clientHeight - adminOpHtml.current.children[0].clientHeight
  }px`;
  mainHtml.current.style.marginTop = `calc(${adminOpHtml.current.children[1].scrollHeight}px + 1.3rem)`;
  uiContainerHtml.current.classList.remove(stylesUi.open);
  uiContainerHtml.current.classList.add(stylesUi.close);
};

export const openFormAdd = () => {
  const formAdd = document.querySelector(`.${stylesInventory.formAdd}`);
  formAdd.style.display = 'flex';
  setTimeout(() => {
    formAdd.style.height = `calc(${formAdd.scrollHeight}px + .5rem)`;
  }, 1);
};

export const closeFormAdd = () => {
  const formAdd = document.querySelector(`.${stylesInventory.formAdd}`);
  formAdd.style.height = `0px`;
  setTimeout(() => {
    formAdd.style.display = 'none';
  }, 300);
};
