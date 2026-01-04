import clsx from "clsx";
import styles from "./Header.module.scss";

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <header className={clsx(styles.root, className)}>
      <h1>Header component</h1>
    </header>
  );
}
