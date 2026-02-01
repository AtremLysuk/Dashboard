"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./DashboardLayout.module.scss";
import { OrderCheck } from "@/components/ui/OrderCheck";
import { OrderCard } from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrders } from "@/redux/slices/orderSlice";
import { OrderStatus } from "../../../types.ui";

export type TOrdersStatus = {
  id: number;
  status: OrderStatus;
};

export default function DashboardPage() {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();
  const myOrders = useAppSelector((state) => state.orders.orders);
  const isLoading = useAppSelector((state) => state.orders.loading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <main>
      <div className={styles.container}>
        <section className={styles.root} aria-labelledby="orders-title">
          <div className={styles.inner}>
            <div className={styles.header}>
              <div className={styles.headerInner}>
                <h1 className={styles.title} id="orders-title">
                  ORDER LIST
                </h1>
                {/*<button className={styles.createOrderBtn} type="button">*/}
                {/*  Create New Order*/}
                {/*</button>*/}
              </div>

              <ul className={styles.list} aria-label="orders-title">
                {myOrders.map(({ id, status }) => (
                  <li className={styles.listItem} key={id}>
                    <OrderCheck id={id} status={status as OrderStatus} />
                  </li>
                ))}
              </ul>
            </div>

            {isLoading && <div className={styles.loading}>Loading orders...</div>}

            {!isLoading && myOrders && myOrders.length > 0 ? (
              <ul className={styles.products}>
                {myOrders.map((order) => (
                  <li className={styles.productsItem} key={order.id}>
                    <OrderCard order={order} />
                  </li>
                ))}
              </ul>
            ) : !isLoading ? (
              <p className={styles.noOrders}>No orders found</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
