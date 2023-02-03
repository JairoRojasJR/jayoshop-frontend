import styles from '../../styles/admin/Ui.module.css';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { createRef, useEffect, useState } from 'react';
import { openAdminOp, closeAdminOp } from '@/services/adminSubNav';

export default function Adminui({ children, currentSection, AddProduct }) {
  const [statusAdminOp, setStatusAdminOp] = useState('open');
  const [initialHeightAdminOp, setInitialHeightAdminOp] = useState();
  const sections = ['inventario', 'vender'];

  const uiContainerHtml = createRef();
  const adminOpHtml = createRef();
  const mainHtml = createRef();

  const sourcesHtml = {
    uiContainerHtml,
    adminOpHtml,
    mainHtml,
  };

  const switchAdminOptions = () => {
    if (statusAdminOp === 'open') setStatusAdminOp('close');
    else setStatusAdminOp('open');
  };

  useEffect(() => {
    const adminOpClientHeight = adminOpHtml.current.clientHeight;
    setInitialHeightAdminOp(adminOpClientHeight);
  }, []);

  useEffect(() => {
    if (statusAdminOp === 'open')
      openAdminOp({ sourcesHtml, initialHeightAdminOp });
    else closeAdminOp({ sourcesHtml });
  }, [statusAdminOp, initialHeightAdminOp]);

  return (
    <div
      ref={uiContainerHtml}
      className={`${styles.uiContainer} ${styles.open} pr`}
    >
      <section
        ref={adminOpHtml}
        className={`${styles.adminOptions} df fdc aic`}
      >
        <nav className={`${styles.sectionsContainer} df jcc`}>
          {sections.map(section => (
            <Link
              key={nanoid(10)}
              href={`/admin/${section}`}
              className={`${styles.sectionBtn} ${
                currentSection === section ? styles.currentSection : ''
              } cp`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Link>
          ))}
        </nav>
        {AddProduct ? (
          <div style={{ width: '90%' }}>
            <AddProduct statusAdminOp={statusAdminOp} />
          </div>
        ) : (
          ''
        )}
        <div
          className={`${styles.switchAdminOptions} cp`}
          onClick={() => switchAdminOptions()}
        >
          <FontAwesomeIcon icon={solid('arrow-up')} />
        </div>
      </section>
      <main ref={mainHtml} className={`${styles.main}`}>
        {children}
      </main>
    </div>
  );
}
