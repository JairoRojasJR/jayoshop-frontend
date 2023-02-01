import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useIsAuthContext } from '@/context/isAuth';

export default function Nav({ styles, changeTheme }) {
  const [statusMenu, setStatusMenu] = useState(0);
  const [windWidth, setWindWidth] = useState(0);
  const [changeResolution, setChangeResolution] = useState(false);
  const { isAuthContext } = useIsAuthContext();

  useEffect(() => {
    setWindWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setWindWidth(window.innerWidth);
      setChangeResolution(true);
    });
  }, []);

  const moveMenu = () => {
    setChangeResolution(false);
    setStatusMenu(statusMenu ? 0 : 1);

    if (!statusMenu) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
  };

  return (
    <nav
      className={`${styles.nav} ${
        statusMenu ? styles.menuOpen : styles.menuClosed
      }`}
    >
      <div className="df aic jcsb" style={{ padding: '1rem .5rem' }}>
        <Link
          href="./"
          className="df aic cp resetLink"
          style={{ gap: '.3rem' }}
        >
          <Image
            src={'/tienda.png'}
            width={50}
            height={50}
            alt={'tienda del barrio'}
          />
          <span className={styles.marca}>LA VECI</span>
        </Link>
        <FontAwesomeIcon
          className={`${styles.icon} ${styles.bars}`}
          style={{ display: `${windWidth <= 400 ? 'flex' : 'none'}` }}
          icon={solid('bars')}
          onClick={moveMenu}
        />
        <div className={styles.deadzone} onClick={moveMenu} />
        <div
          className={`${windWidth <= 400 ? styles.menu : ''} ${
            changeResolution ? styles.notrans : ''
          } df aic`}
          style={{ gap: '.5rem' }}
        >
          <Link className={`${styles.menuIcon} resetLink`} href={'/'}>
            <FontAwesomeIcon className={styles.icon} icon={solid('house')} />
          </Link>
          <Link className={`${styles.menuIcon} resetLink`} href={'/productos'}>
            <FontAwesomeIcon
              className={styles.icon}
              icon={solid('basket-shopping')}
            />
          </Link>
          <Link className={`${styles.menuIcon} resetLink`} href={'/carrito'}>
            <FontAwesomeIcon
              className={styles.icon}
              icon={solid('cart-shopping')}
            />
          </Link>
          <Link className={`${styles.menuIcon} resetLink`} href={'/login'}>
            <FontAwesomeIcon
              className={`${styles.icon}`}
              icon={solid('circle-user')}
            />
          </Link>
          {isAuthContext.isIpAdmin ? (
            <Link
              className={`${styles.menuIcon}`}
              href={`/admin/${
                isAuthContext.authenticated ? 'inventario' : 'login'
              }`}
            >
              <FontAwesomeIcon
                className={`${styles.icon}`}
                icon={solid('key')}
              />
            </Link>
          ) : (
            ''
          )}
          {isAuthContext.authenticated ? (
            <Link className={`${styles.menuIcon}`} href={`/admin/logout`}>
              <FontAwesomeIcon
                className={`${styles.icon}`}
                icon={solid('arrow-right-from-bracket')}
              />
            </Link>
          ) : (
            ''
          )}
          <div className={`${styles.menuIcon}`} onClick={changeTheme}>
            <FontAwesomeIcon
              className={`${styles.icon}`}
              icon={solid('star-half-stroke')}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
