import clsx from "clsx";
import styles from "./Statistics.module.scss";

export default function page() {
  return (
    <div className={clsx(styles.root)}>
      <div className={styles.inner}>
        <h2>Statistics</h2>
      </div>
    </div>
  );
}
