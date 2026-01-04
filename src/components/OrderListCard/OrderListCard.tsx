import clsx from "clsx";
import styles from "./OrderListCard.module.scss";

type Props = {
  className?: string;
};

export default function OrderListCard({ className }: Props) {
  return (
    <article className={clsx(styles.root, className)}>
      <div className={styles.inner}>OrderCArd</div>
    </article>
  );
}
