import styles from '../../styles/admin/Ui.module.css';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';

export default function SubNav({ productsSections }) {
  const router = useRouter();

  return (
    <nav className={`${styles.productsSections} df jcse`}>
      {productsSections.map(section => (
        <Link
          key={nanoid(10)}
          className={`${styles.productsSection} df pcc`}
          href={`/admin/inventario${
            section !== 'todo' ? '?section=' + section : ''
          }`}
          style={
            section === router.query?.section ||
            (section === 'todo' && JSON.stringify(router.query) === '{}')
              ? { background: '#7fffd4', color: '#0B0B2B' }
              : {}
          }
          onClick={() =>
            router.push(
              `/admin/inventario${
                section !== 'todo' ? '?section=' + section : ''
              }`
            )
          }
        >
          {section[0].toUpperCase() + section.slice(1)}
        </Link>
      ))}
    </nav>
  );
}
