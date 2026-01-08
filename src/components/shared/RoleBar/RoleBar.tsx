"use client";
import clsx from "clsx";
import styles from "./RoleBar.module.scss";
import { Bell } from "lucide-react";
import { useState } from "react";

type Props = {
  className?: string;
};

export default function RoleBar({ className }: Props) {
  const [role, setRole] = useState("admin");

  return (
    <div className={clsx(styles.root, className)}>
      <div className={clsx(styles.round, className)}>
        <span>A</span>
      </div>
      <select className={styles.select} name="roles" id="roles">
        <option value="user">User Role</option>
        <option value="admin">Admin Role</option>
      </select>

      <Bell className={styles.bellIcon} size={21} />
    </div>
  );
}
