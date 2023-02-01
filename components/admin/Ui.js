import Router from 'next/router';
import { useEffect } from 'react';
import styles from '../../styles/admin/Ui.module.css';

export default function Adminui({ children }) {
  return (
    <div>
      <section className={`${styles.sectionsContainer} df jcc`}>
        <button className={`${styles.sectionBtn} cp`}>Inventario</button>
        <button className={`${styles.sectionBtn} cp`}>Vender</button>
      </section>
      {children}
    </div>
  );
}
