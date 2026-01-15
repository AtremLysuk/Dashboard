import clsx from "clsx";
import styles from "./History.module.scss";

export default function page() {
  return (
    <section className={clsx(styles.root)}>
      <div className={styles.inner}>
        <h1 className={styles.title}>History Page</h1>
      </div>
    </section>
  );
}
