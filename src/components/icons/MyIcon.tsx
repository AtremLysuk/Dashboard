import { IconName, icons } from "./index";
import clsx from "clsx";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  title?: string;
};

export const MyIcon = ({
  name,
  size = 24,
  color = "currentColor",
  className,
  title,
}: IconProps) => {
  const Icon = icons[name];

  if (!Icon) return null;

  return (
    <span
      className={clsx("inline-flex", className)}
      style={{ width: size, height: size, color }}
      aria-label={title}
      role={title ? "img" : "presentation"}
    >
      <Icon width={size} height={size} aria-hidden={!title} focusable={false}></Icon>
    </span>
  );
};
