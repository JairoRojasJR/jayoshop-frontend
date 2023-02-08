import styles from '@/components/JToast.module.css';

const jtoast = (msg, { duration }) => {
  const jtoastPanel = document.getElementById('JToast');
  const jtoastItem = document.createElement('span');
  jtoastItem.classList.add(`${styles.jtoastItem}`);
  jtoastItem.textContent = msg;

  jtoastPanel.appendChild(jtoastItem);
  jtoastItem.style.animation = `${styles.appear} .3s forwards`;
  setTimeout(() => {
    jtoastItem.style.animation = `${styles.disappear} .3s forwards`;
    setTimeout(() => jtoastPanel.removeChild(jtoastItem), 300);
  }, duration);
};

function JToast() {
  return <div id="JToast" className={`${styles.jtoastPanel}`}></div>;
}

module.exports = {
  jtoast,
  JToast,
};
