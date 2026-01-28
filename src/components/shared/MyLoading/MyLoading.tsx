import React from "react";

type Props = {
  className?: string;
};

export default function MyLoading({ className }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      Loading...
    </div>
  );
}
