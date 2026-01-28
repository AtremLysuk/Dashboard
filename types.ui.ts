import { IconName } from "@/components/icons";

export type OrderStatus =
  | "NEW"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type OrderStatusUI = {
  label: string;
  icon: IconName;
  className: string;
};

export const ORDER_STATUS_UI = {
  NEW: {
    label: "New",
    icon: "clock",
    className: "new",
  },
  PENDING: {
    label: "Pending",
    icon: "clock",
    className: "pending",
  },
  IN_PROGRESS: {
    label: "In progress",
    icon: "etc",
    className: "inProgress",
  },
  COMPLETED: {
    label: "Completed",
    icon: "complete",
    className: "completed",
  },
  REJECTED: {
    label: "Rejected",
    icon: "close",
    className: "rejected",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: "close",
    className: "cancelled",
  },
} satisfies Record<OrderStatus, OrderStatusUI>;

export function toOrderStatus(status: string): OrderStatus {
  const upperStatus = status.toUpperCase();
  if (isOrderStatus(upperStatus)) {
    return upperStatus;
  }
  return "NEW";
}

export function isOrderStatus(status: string): status is OrderStatus {
  return ["NEW", "PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED", "CANCELLED"].includes(status);
}
