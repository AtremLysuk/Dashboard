"use client";
import clsx from "clsx";
import styles from "./SignOutButton.module.scss";
import { signOut } from "next-auth/react";

type Props = {
  className?: string;
};

export default function SignOutButton({ className }: Props) {
  return (
    <div className={clsx(styles.root, className)}>
      <button
        type="button"
        className={styles.signOutBtn}
        onClick={() => signOut({ callbackUrl: "/signin" })}
      >
        Sign Out
      </button>
    </div>
  );
}
