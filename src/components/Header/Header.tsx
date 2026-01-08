import clsx from "clsx";
import styles from "./Header.module.scss";
import SearchInput from "@/components/shared/Search/Search";
import RoleBar from "@/components/shared/RoleBar/RoleBar";

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <header className={clsx(styles.root, className)}>
      <div className={styles.inner}>
        <SearchInput />
        <RoleBar />
      </div>
    </header>
  );
}
