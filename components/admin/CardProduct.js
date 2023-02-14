import styles from '../../styles/admin/Inventory.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { copyToClipboard } from '@/services/copyToClipboard';
import { openModal } from '@/services/openModalActions';

export default function CardProduct({ product, adminOp, setAdminOp }) {
  const router = useRouter();

  const selectProduct = () => {
    const preAdminOp = { ...adminOp };
    const productIndex = preAdminOp.productInAction.findIndex(
      element => element === product
    );
    if (productIndex >= 0) preAdminOp.productInAction.splice(productIndex, 1);
    else preAdminOp.productInAction.push(product);
    setAdminOp(preAdminOp);
  };

  const runCard = e => {
    if (adminOp?.action[0] && !adminOp.multipleCheck)
      return openModal(e, adminOp, setAdminOp, product);
    else if (adminOp?.multipleCheck && adminOp?.action[0] === 'trash')
      return selectProduct(product._id);
  };

  const productIndex = adminOp?.productInAction.findIndex(
    element => element === product
  );

  let classNames = `${styles.product} w100p`;
  if (adminOp?.action[0]) classNames += ` ${styles.actionActivated} cp`;
  if (productIndex >= 0 && adminOp.multipleCheck)
    classNames += ` ${styles.trashSelected}`;

  return (
    <article id={product._id} className={classNames} onClick={e => runCard(e)}>
      <span className={`${styles.productComponent} ${styles.image} df jcc pr`}>
        {JSON.stringify(router.query) === '{}' ? (
          <div
            className={`${styles.floatInfoProduct} ${styles.section} tac pa`}
          >
            {product.section[0].toUpperCase() + product.section.slice(1)}
          </div>
        ) : (
          ''
        )}
        <Image
          src={'/panchitos.jpg'}
          fill
          alt="panchitos"
          style={{ objectFit: 'cover', borderRadius: '.3rem' }}
          sizes="(max-width: 768px) 100vw,
                                (max-width: 1200px) 50vw,
                                33vw"
        />
      </span>
      <h3 className={`${styles.productComponent} ${styles.title}`}>
        {product.name}
      </h3>
      <div className={`${styles.productComponent} ${styles.desc}`}>
        {product.description}
      </div>
      <span className={`${styles.barcode} df jcc`}>
        <span className={`cp`} onClick={() => copyToClipboard(product.barcode)}>
          <FontAwesomeIcon icon={solid('barcode')} />
          <FontAwesomeIcon icon={solid('barcode')} />
        </span>
      </span>
      <div
        className={`${styles.productComponent} ${styles.infoProduct} df jcfe`}
      >
        <span className={`${styles.productComponent} ${styles.stock}`}>
          <FontAwesomeIcon icon={solid('layer-group')} />x{product.cuantity}
        </span>
        <span className={`${styles.productComponent} ${styles.precio}`}>
          <FontAwesomeIcon icon={solid('money-bill')} />
          {product.price}$
        </span>
      </div>
    </article>
  );
}
