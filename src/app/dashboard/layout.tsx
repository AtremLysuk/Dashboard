"use client";

import Header from "@/components/Header/Header";
import Aside from "@/components/Aside/Aside";
import styles from "./DashboardLayout.module.scss";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/dashboard/Loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading></Loading>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.rootContainer}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.aside}>
        <Aside />
      </div>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
