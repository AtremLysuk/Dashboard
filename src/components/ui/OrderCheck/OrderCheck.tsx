import clsx from "clsx";
import styles from "./OrderCheck.module.scss";
import { MyIcon } from "@/components/icons/MyIcon";
import { ORDER_STATUS_UI, OrderStatus } from "../../../../types.ui";

type Props = {
  id: number;
  status: OrderStatus;
  className?: string;
};

export default function OrderCheck({ className, status, id }: Props) {
  const uiConfig = ORDER_STATUS_UI[status];

  const getIconColor = (status: OrderStatus): string => {
    switch (status) {
      case "NEW":
        return "#4CAF50"; // зеленый
      case "PENDING":
        return "#FF9800"; // оранжевый
      case "IN_PROGRESS":
        return "#2196F3"; // синий
      case "COMPLETED":
        return "#9C27B0"; // фиолетовый
      case "REJECTED":
      case "CANCELLED":
        return "#F44336"; // красный
      default:
        return "currentColor";
    }
  };

  return (
    <button type="button" className={clsx(styles.root, styles[uiConfig.className], className)}>
      <MyIcon
        name={uiConfig.icon}
        size={22}
        color={getIconColor(status)}
        className={clsx(styles.icon)}
      />
      <span className={clsx(styles.label)}>#{id}</span>
    </button>
  );
}
