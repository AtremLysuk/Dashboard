import styles from "./DashboardLayout.module.scss";

export default function DashboardPage() {
  return (
    <main>
      <h2>Dashboard Page</h2>{" "}
      <section className={styles.root} aria-labelledby="orders-title">
        <div className={styles.inner}>
          <div className={styles.header}>
            <h2 className={styles.title} id="orders-title">
              Order List
            </h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>Order #1001 - Completed</li>
            </ul>
          </div>
          <ul className={styles.items}>
            <li className={styles.item}>
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>Order #1001</h3>
                <p className={styles.itemStatus}>Status: Completed</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
