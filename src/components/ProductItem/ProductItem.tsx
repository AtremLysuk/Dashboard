import clsx from "clsx";
import styles from "./ProductItem.module.scss";
import Image from "next/image";
import { Product } from "../../../types";

type Props = {
  className?: string;
  product: Product;
};

export default function ProductItem({ className, product }: Props) {
  const { id, ingredients, title, variants, imageUrl } = product;
  const { id: variantId, size, price } = variants;
  const productIngredients = [...ingredients];

  return (
    <article className={clsx(styles.root, className)}>
      <div className={styles.inner}>
        <Image
          className={styles.image}
          src={imageUrl}
          alt={`Card of ${title}`}
          width={180}
          height={180}
        />
        <div className={styles.productContent}>
          <h2 className={styles.title}>{title}</h2>
          <span>{id}</span>
        </div>
        <div className={styles.buttons}>
          <button className={styles.editBtn} type="button">
            Edit
          </button>
          <button className={styles.deleteBtn} type="button">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
