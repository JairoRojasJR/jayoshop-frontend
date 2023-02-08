import styles from '../../styles/admin/Ui.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { createRef, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { openAdminOp, closeAdminOp } from '@/services/adminSubNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function Adminui({ children, currentSection }) {
  const [statusAdminOp, setStatusAdminOp] = useState('open');
  const [initialHeightAdminOp, setInitialHeightAdminOp] = useState();
  const sections = ['inventario', 'vender'];
  const therePlusOptions = children[0]?.props.plus;
  const plusOptions = therePlusOptions ? children[0].props.children : null;

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
      <section ref={adminOpHtml} className={`${styles.adminOptions} df fdc`}>
        <div className={`${styles.adminOption} df fdc aic pr`}>
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
          {plusOptions
            ? plusOptions.filter(option => option.props.position === 'in')
            : ''}
          <FontAwesomeIcon
            icon={solid('arrow-up')}
            className={`${styles.switchAdminOptions} cp`}
            onClick={() => switchAdminOptions()}
          />
        </div>
        <div className={`${styles.adminOption}`}>
          {plusOptions
            ? plusOptions.filter(option => option.props.position === 'out')
            : ''}
        </div>
      </section>
      <main ref={mainHtml} className={`${styles.main}`}>
        {therePlusOptions ? children.slice(1) : children}
      </main>
    </div>
  );
}
