"use client";
import clsx from "clsx";
import styles from "./Aside.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MyIcon } from "@/components/icons/MyIcon";
import type { IconName } from "../icons/index";

type Icons = {
  name: IconName;
  label: string;
  path: string;
};

type Props = {
  className?: string;
};

export default function Aside({ className }: Props) {
  const pathName = usePathname();
  const menuItems: Icons[] = [
    {
      name: "home",
      label: "home",
      path: "/dashboard",
    },
    {
      name: "clock",
      label: "ORDER HISTORY",
      path: "/dashboard/history",
    },
    {
      name: "messages",
      label: "messages",
      path: "/dashboard/messages",
    },
    {
      name: "statistics",
      label: "statistics",
      path: "/dashboard/statistics",
    },
    {
      name: "products",
      label: "PRODUCTS",
      path: "/dashboard/products",
    },
    {
      name: "settings",
      label: "settings",
      path: "/dashboard/settings",
    },
  ];

  return (
    <aside className={clsx(styles.root, className)}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <img src="/icons/logo.svg" alt="logo" width={105} height={80} />
        </div>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li className={styles.menuItem} key={item.path}>
              <Link
                href={item.path}
                className={clsx(
                  styles.menuLink,
                  item.path === pathName && styles["menuLink-active"],
                )}
                aria-current={item.path === pathName ? "page" : undefined}
              >
                <MyIcon
                  name={item.name}
                  size={24}
                  className={clsx(styles.icon, item.path === pathName && styles.active)}
                />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
