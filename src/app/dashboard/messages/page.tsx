import clsx from "clsx";
import styles from "./Messages.module.scss";

export default function page() {
  return (
    <section className={clsx(styles.root)}>
      <div className={styles.inner}></div>
    </section>
  );
}
