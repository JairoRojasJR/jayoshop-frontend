import styles from '@/styles/admin/CardProduct.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { copyToClipboard } from '@/services/copyToClipboard';
import { openModal } from '@/services/openModalActions';
export default function CardProduct({
  product,
  adminOp,
  setAdminOp,
  selecteds,
  setSelecteds,
  updated,
}) {
  const selectProduct = () => {
    const preSelecteds = { ...selecteds };
    if (!selecteds[product._id]) preSelecteds[product._id] = true;
    else delete preSelecteds[product._id];
    setSelecteds(preSelecteds);
  };

  const runCard = e => {
    e.stopPropagation();
    if (adminOp?.action[0]) {
      if (!adminOp.multipleCheck) openModal({ adminOp, setAdminOp, product });
      else selectProduct();
    }
  };

  let classNames = `${styles.product} w100p`;
  if (adminOp?.action[0]) classNames += ` ${styles.actionActivated} cp`;
  if (adminOp) {
    if (selecteds[product._id])
      classNames += ` ${styles.trashSelected} productSelected`;
  }

  const getStyleUpdated = field => {
    if (updated) {
      if (field === 'image' && updated[field])
        return { outline: '.3rem solid #7fffd4' };
      else if (updated[field]) return { color: '#7fffd4' };
    }
    return {};
  };

  let urlImg;
  if (product.image.includes('blob:http')) urlImg = product.image;
  else urlImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stream/image/${product.image}`;

  return (
    <article id={product._id} className={classNames} onClick={e => runCard(e)}>
      <span className={`${styles.productComponent} ${styles.image} df jcc pr`}>
        {adminOp?.section === 'todo' || !adminOp ? (
          <div
            className={`${styles.floatInfoProduct} ${styles.section} tac pa`}
            style={getStyleUpdated('section')}
          >
            {product.section[0].toUpperCase() + product.section.slice(1)}
          </div>
        ) : (
          ''
        )}
        <Image
          src={urlImg}
          loader={data => `${urlImg}?width=${data.width}`}
          fill
          alt="panchitos"
          style={{
            objectFit: 'cover',
            borderRadius: '.3rem',
            ...getStyleUpdated('image'),
          }}
          sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
        />
      </span>
      <h3
        className={`${styles.productComponent} ${styles.title}`}
        style={getStyleUpdated('name')}
      >
        {product.name}
      </h3>
      <div
        className={`${styles.productComponent} ${styles.desc}`}
        style={getStyleUpdated('description')}
      >
        {product.description}
      </div>
      <span
        className={`${styles.barcode} df jcc`}
        style={getStyleUpdated('barcode')}
      >
        <span className={`cp`} onClick={() => copyToClipboard(product.barcode)}>
          <FontAwesomeIcon icon={solid('barcode')} />
          <FontAwesomeIcon icon={solid('barcode')} />
        </span>
      </span>
      <div
        className={`${styles.productComponent} ${styles.infoProduct} df jcfe`}
      >
        <span
          className={`${styles.productComponent} ${styles.stock}`}
          style={getStyleUpdated('cuantity')}
        >
          <FontAwesomeIcon icon={solid('layer-group')} />x{product.cuantity}
        </span>
        <span
          className={`${styles.productComponent} ${styles.precio}`}
          style={getStyleUpdated('price')}
        >
          <FontAwesomeIcon icon={solid('money-bill')} />
          {product.price}$
        </span>
      </div>
    </article>
  );
}
