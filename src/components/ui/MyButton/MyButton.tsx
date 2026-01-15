// import clsx from "clsx";
// import styles from "./MyButton.module.scss";
// import { MyIcon } from "@/components/icons/MyIcon";
// import type { IconName } from "@/components/icons";
//
// type OrderStatus = "new" | "in-progress" | "completed" | "rejected" | "pending";
//
// type TBtn = {
//   status: OrderStatus;
//   title: string;
// };
//
// type Props = {
//   status: OrderStatus;
//   className?: string;
// };
//
// const btnStyles: Record<OrderStatus, string> = {
//   new: styles.new,
//   "in-progress": styles.inProgress,
//   completed: styles.completed,
//   rejected: styles.rejected,
//   pending: styles.pending,
// };
//
// const statusToIcon: Record<OrderStatus, IconName> = {
//   new: "complete",
//   "in-progress": "complete",
//   completed: "complete",
//   rejected: "close",
//   pending: "close",
// };
//
// export default function MyButton({ status, className }: Props) {
//   return (
//     <div className={clsx(styles.root)}>
//       <button className={clsx(styles.btn, styles.btnStyles[status])} type="button">
//         <MyIcon name={statusToIcon[status]} size={17} />
//         {status === "completed" && "Completed"}
//         {status === "rejected" && "Rejected"}
//       </button>
//     </div>
//   );
// }
