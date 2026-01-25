import clsx from "clsx";
import styles from "./OrderCard.module.scss";
import { MyIcon } from "@/components/icons/MyIcon";
import { ORDER_STATUS_UI } from "../../../types.ui";
import Image from "next/image";
import { Client, Order, OrderItem } from ".prisma/client";

type OrderStatus = "new" | "in-progress" | "completed" | "rejected" | "pending";

type TClient = Pick<Client, "id" | "name">;

type TProduct = Pick<OrderItem, "id" | "title" | "imageUrl" | "price" | "quantity">;
type TOrderItem = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  price: number;
  quantity: number;

  subtitle?: string;
};

type TOrder = Pick<
  Order,
  "id" | "createdAt" | "status" | "customerName"
  // | "customerPhone"
  // | "deliveryAddress"
  // | "total"
  // | "subtotal"
  // | "orderNumber"
> & {
  items: TOrderItem[];
  client: TClient;
};

// type TOrder = {
//   id: number;
//   createdAt: string;
//   status: OrderStatus;
//   client: TClient;
//   items: TOrderItem[];
//   customerName: string;
// };

type Props = {
  order: TOrder;
  className?: string;
};

export default function OrderCard({ order, className }: Props) {
  const { id, createdAt, status, customerName, items } = order;

  console.log(order);
  const date = new Date(createdAt);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const titleId = `order=${id}-title`;
  const meta = ORDER_STATUS_UI[order.status];

  const quantity = order.items.reduce((accum, product) => {
    accum += product.quantity;
    return accum;
  }, 0);
  const totalOrderPrice = order.items.reduce((sum, product) => {
    sum += product.price * product.quantity;
    return sum;
  }, 0);

  return (
    <article className={clsx(styles.root, className)} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <h3 className={styles.headerTitle} id={titleId}>
              Order #{id}
            </h3>
            <time className={styles.headerDate} dateTime={date.toISOString()}>
              {formatDate(date)}
            </time>
          </div>
          {/*<span className={clsx(styles.badge, styles[meta.className])}>*/}
          {/*  <MyIcon name={meta.icon} />*/}
          {/*  {meta.label}*/}
          {/*</span>*/}
          <div className={styles.avatar} aria-label={`Client: ${customerName}`}>
            {customerName[0]}
          </div>
        </header>
        <ul className={styles.productsList}>
          {items.map((product) => (
            <li className={styles.productsItem} key={product.id}>
              <Image src={product.imageUrl} alt={product.title} width={85} height={85} />
              <div className={styles.productContent}>
                <h4 className={styles.productTitle}>{product.title}</h4>
                <p className={styles.productSubitle}>{product.subtitle}</p>
                <div className={styles.productBot}>
                  <span aria-label={`product price: ${product.price}`}>${product.price}</span>
                  <span aria-label={`product quantity: ${product.quantity}`}>
                    Qty: {product.quantity}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <footer className={styles.footer}>
          <div className={styles.footerInfo}>
            <span aria-label={`Total items: ${quantity}`}>{quantity}</span>
            <span aria-label={`Total price: ${totalOrderPrice}`}>${totalOrderPrice}</span>
          </div>

          {status !== "completed" && status !== "rejected" && (
            <div className={styles.buttons}>
              <button
                className={styles.buttonAccept}
                aria-label={`Accept ${order.id}`}
                type="button"
              >
                <MyIcon name="complete" size={17} color="#fff" aria-hidden={true} />
              </button>
              <button
                className={styles.buttonReject}
                aria-label={`Reject ${order.id}`}
                type="button"
              >
                <MyIcon name="close" size={17} color="#9c9292" aria-hidden={true} />
              </button>
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}
