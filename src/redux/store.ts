import { configureStore } from "@reduxjs/toolkit";
import orderSliceReducer from "@/redux/slices/orderSlice";
import productSliceReducer from "@/redux/slices/productSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      orders: orderSliceReducer,
      products: productSliceReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
