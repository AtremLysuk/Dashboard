import clsx from "clsx";
import styles from "./Settings.module.scss";

export default function page() {
  return (
    <div className={clsx(styles.root)}>
      <div className={styles.inner}>
        <h2>Settings</h2>
      </div>
    </div>
  );
}
