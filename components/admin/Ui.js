import styles from '../../styles/admin/Ui.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { createRef, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { openAdminOp, closeAdminOp } from '@/services/adminSubNav';

export default function Adminui({
  children,
  currentSection,
  repositionSubnav,
}) {
  const [statusAdminOp, setStatusAdminOp] = useState('open');
  const [initialHeightAdminOp, setInitialHeightAdminOp] = useState();
  const sections = ['inventario', 'vender'];
  const therePlusOptions = children[0]?.props.plus;

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

  useEffect(() => {
    const navMain = document.getElementById('navMain');
    let newTopSubnav;
    if (statusAdminOp === 'open') {
      newTopSubnav = navMain.clientHeight + adminOpHtml.current.clientHeight;
    }
    else {
      newTopSubnav = navMain.clientHeight;
    }
    if(repositionSubnav) repositionSubnav(newTopSubnav);
  }, [statusAdminOp]);

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
        {therePlusOptions ? children[0] : ''}
        <Image
          className={`${styles.switchAdminOptions} cp`}
          onClick={() => switchAdminOptions()}
          alt="circle up"
          src={'/caret-circle-up.png'}
          width={30}
          height={30}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
      </section>
      <main ref={mainHtml} className={`${styles.main}`}>
        {therePlusOptions ? children.slice(1) : children}
      </main>
    </div>
  );
}
