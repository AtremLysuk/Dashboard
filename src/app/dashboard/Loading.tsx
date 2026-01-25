import clsx from "clsx";
import styles from "./Loading.module.scss";

type Props = {
  className?: string;
};

export default function Loading({ className }: Props) {
  return <div className={clsx(styles.root, className)}></div>;
}
