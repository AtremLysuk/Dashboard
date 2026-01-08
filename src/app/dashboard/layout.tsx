import Header from "@/components/Header/Header";
import Aside from "@/components/Aside/Aside";
import styles from "./DashboardLayout.module.scss";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.rootContainer}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.aside}>
          <Aside />
        </div>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </>
  );
}
