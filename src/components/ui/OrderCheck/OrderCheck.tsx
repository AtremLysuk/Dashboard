import clsx from "clsx";
import styles from "./OrderCheck.module.scss";
import { MyIcon } from "@/components/icons/MyIcon";
import type { IconName } from "@/components/icons/index";

type OrderStatus = "new" | "in-progress" | "completed" | "rejected" | "pending";

type Props = {
  id: number;
  status: OrderStatus;
  className?: string;
};

const statusClasses: Record<OrderStatus, string> = {
  new: styles.new,
  "in-progress": styles.inProgress,
  completed: styles.completed,
  rejected: styles.rejected,
  pending: styles.pending,
};

const statusToIcon: Record<OrderStatus, IconName> = {
  new: "complete",
  "in-progress": "complete",
  completed: "complete",
  rejected: "close",
  pending: "close",
};

export default function OrderCheck({ className, status, id }: Props) {
  return (
    <button type="button" className={clsx(styles.root, statusClasses[status], className)}>
      <MyIcon name={statusToIcon[status]} size={17} className={clsx(styles.icon)} />
      <span className={clsx(styles.label)}>#{id}</span>
    </button>
  );
}
