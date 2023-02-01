import { useEffect, useState } from 'react';
import styles from '../styles/Layout.module.css';
import Nav from '../components/Nav';
import End from '../components/home/End';

export default function Layout({ data, children }) {
  const [vh, setVh] = useState('100vh');
  const [theme, setTheme] = useState(0);

  useEffect(() => {
    setVh(window.innerHeight);

    document.body.classList.remove('no-scroll');
  }, []);

  const cssVar = {
    '--primary': ['#1B1B3B', '#EFEFEF'],
    '--secondary': ['#EFEFEF', '#1B1B3B'],
    '--darkprimary': ['#0B0B2B', '#F8F8F8'],
    '--darksecondary': ['#F8F8F8', '#0B0B2B'],
    '--primaryfontcolor': ['#EFEFEF', '#1B1B3B'],
    '--secondaryfontcolor': ['#1B1B3B', '#EFEFEF'],
  };

  const changeTheme = () => {
    setTheme(theme === 0 ? 1 : 0);

    for (let v in cssVar) {
      document.documentElement.style.setProperty(
        v,
        theme === 0 ? cssVar[v][0] : cssVar[v][1]
      );
    }
  };

  return (
    <>
      <div className="df fdc jcsb" style={{ minHeight: vh }}>
        <Nav styles={styles} changeTheme={changeTheme} />
        <div className={styles.content}>{children}</div>
        <footer className={`${styles.footer}`}>
          <End />
        </footer>
      </div>
    </>
  );
}