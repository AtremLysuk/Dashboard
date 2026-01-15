import { IconName } from "@/components/icons";

export type OrderStatus = "new" | "pending" | "in-progress" | "completed" | "rejected";

export type OrderStatusUI = {
  label: string;
  icon: IconName;
  className: string;
};

export const ORDER_STATUS_UI = {
  new: { label: "New", icon: "clock", className: "badgeNew" },
  pending: { label: "Pending", icon: "clock", className: "badgePending" },
  "in-progress": { label: "In progress", icon: "etc", className: "badgeProgress" },
  completed: { label: "Completed", icon: "complete", className: "badgeComplete" },
  rejected: { label: "Rejected", icon: "close", className: "badgeRejected" },
} satisfies Record<OrderStatus, OrderStatusUI>;
