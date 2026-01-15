import styles from "./DashboardLayout.module.scss";
import { OrderCheck } from "@/components/ui/OrderCheck";
import { OrderCard } from "@/components/OrderCard";

type OrderStatus = "new" | "in-progress" | "completed" | "rejected" | "pending";
export type TOrder = {
  id: number;
  status: OrderStatus;
};

type TClient = {
  id: number;
  name: string;
};

type TProduct = {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  subtitle: string;
  quantity: number;
};

type TFakeOrder = {
  id: number;
  createdAt: Date;
  status: OrderStatus;
  client: TClient;
  products: TProduct[];
};

export default function DashboardPage() {
  const orders: TOrder[] = [
    {
      id: 105,
      status: "new",
    },
    {
      id: 106,
      status: "in-progress",
    },
    {
      id: 107,
      status: "completed",
    },
    {
      id: 108,
      status: "rejected",
    },
    {
      id: 109,
      status: "pending",
    },
    {
      id: 110,
      status: "completed",
    },
    {
      id: 111,
      status: "in-progress",
    },
    {
      id: 112,
      status: "new",
    },
  ];

  const fakeOrder: TFakeOrder[] = [
    {
      id: 215,
      createdAt: new Date("2025-01-10T14:22:00"),
      status: "in-progress" as OrderStatus,
      client: {
        id: 1,
        name: "John",
      },
      products: [
        {
          id: 1,
          title: "Loin of Venison",
          subtitle: "Black Pudding Puree & Jerk",
          imageUrl: "/images/products/venison.png",
          price: 12.5,
          quantity: 1,
        },
        {
          id: 2,
          title: "Spicy Chicken Pizza",
          subtitle: "Mozzarella, Chili, BBQ Sauce",
          imageUrl: "/images/products/pizza.png",
          price: 9.75,
          quantity: 2,
        },
      ],
    },
    {
      id: 235,
      createdAt: new Date("2025-01-10T14:22:00"),
      status: "in-progress" as OrderStatus,
      client: {
        id: 1,
        name: "John",
      },
      products: [
        {
          id: 1,
          title: "Loin of Venison",
          subtitle: "Black Pudding Puree & Jerk",
          imageUrl: "/images/products/venison.png",
          price: 12.5,
          quantity: 1,
        },
        {
          id: 2,
          title: "Spicy Chicken Pizza",
          subtitle: "Mozzarella, Chili, BBQ Sauce",
          imageUrl: "/images/products/pizza.png",
          price: 9.75,
          quantity: 2,
        },
      ],
    },
    {
      id: 315,
      createdAt: new Date("2025-01-10T14:22:00"),
      status: "in-progress" as OrderStatus,
      client: {
        id: 1,
        name: "John",
      },
      products: [
        {
          id: 1,
          title: "Loin of Venison",
          subtitle: "Black Pudding Puree & Jerk",
          imageUrl: "/images/products/venison.png",
          price: 12.5,
          quantity: 1,
        },
        {
          id: 2,
          title: "Spicy Chicken Pizza",
          subtitle: "Mozzarella, Chili, BBQ Sauce",
          imageUrl: "/images/products/pizza.png",
          price: 9.75,
          quantity: 2,
        },
      ],
    },
  ];

  return (
    <main>
      <div className={styles.container}>
        <section className={styles.root} aria-labelledby="orders-title">
          <div className={styles.inner}>
            <div className={styles.header}>
              <h1 className={styles.title} id="orders-title">
                ORDER LIST
              </h1>
              <ul className={styles.list} aria-label="orders-title">
                {orders.map(({ id, status }) => (
                  <li className={styles.listItem} key={id}>
                    <OrderCheck id={id} status={status} />
                  </li>
                ))}
              </ul>
            </div>
            <ul className={styles.products}>
              {fakeOrder.map((order) => (
                <li className={styles.productsItem} key={order.id}>
                  <OrderCard order={order} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
