import clsx from "clsx";
import styles from "./History.module.scss";

type Props = {
  className?: string;
};

export default function Loading() {
  return (
    <div className={clsx(styles.root)}>
      <h2>...Loading</h2>
    </div>
  );
}
