"use client";
import clsx from "clsx";
import styles from "./Search.module.scss";
import { useState } from "react";
import { Search } from "lucide-react";

type Props = {
  className?: string;
};

export default function SearchInput({ className }: Props) {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className={clsx(styles.root, className)}>
      <Search className={styles.searchIcon} size={25} />
      <input
        className={clsx(styles.searchInput, className)}
        type="search"
        name="search"
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}
