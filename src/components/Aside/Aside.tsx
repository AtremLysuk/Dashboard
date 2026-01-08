"use client";
import clsx from "clsx";
import styles from "./Aside.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  className?: string;
};

export default function Aside({ className }: Props) {
  const pathName = usePathname();
  const menuItems = [
    {
      label: "Home",
      path: "/dashboard",
      iconPath: "/icons/home.svg",
    },
    {
      label: "ORDER HISTORY",
      path: "/dashboard/history",
      iconPath: "/icons/clock.svg",
    },
    {
      label: "MESSAGES",
      path: "/dashboard/messages",
      iconPath: "/icons/messages.svg",
    },
    {
      label: "STATISTICS",
      path: "/dashboard/statistics",
      iconPath: "/icons/statistics.svg",
    },
    {
      label: "PRODUCTS",
      path: "/dashboard/products",
      iconPath: "/icons/products.svg",
    },
    {
      label: "SETTINGS",
      path: "/dashboard/settings",
      iconPath: "/icons/settings.svg",
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
              >
                <img
                  className={styles.icon}
                  src={item.iconPath}
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden={true}
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
