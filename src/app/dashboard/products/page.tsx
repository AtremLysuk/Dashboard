import clsx from "clsx";
import styles from "./Products.module.scss";

export default function page() {
  return (
    <div className={clsx(styles.root)}>
      <div className={styles.inner}>
        <h2>Products</h2>
      </div>
    </div>
  );
}
