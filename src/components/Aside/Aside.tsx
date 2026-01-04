import clsx from "clsx";
import styles from "./Aside.module.scss";

type Props = {
  className?: string;
};

export default function Aside({ className }: Props) {
  return (
    <div className={clsx(styles.root, className)}>
      <h1>Aside page</h1>
    </div>
  );
}
