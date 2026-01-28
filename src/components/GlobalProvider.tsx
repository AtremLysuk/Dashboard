"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/redux/store";

interface GlobalProviderProps {
  children: ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <Provider store={storeRef.current}>{children}</Provider>
    </SessionProvider>
  );
}
