import React from "react";

type Props = {
  className?: string;
};

export default function Loading({ className }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      Loading...
    </div>
  );
}
