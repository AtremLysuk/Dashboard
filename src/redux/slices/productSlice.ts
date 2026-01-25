import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from ".prisma/client";

type TInitialState = {
  products: Product[] | [];
  status: "pending" | "success" | "rejected" | "idle";
  error: string | null;
};

const initialState: TInitialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProductsByCategory = createAsyncThunk<Product[], number, { rejectValue: string }>(
  "products/fetchProductsByCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/categories/${id}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (e) {
      if (e instanceof Error) {
        return rejectWithValue(e.message);
      }

      return rejectWithValue("An unknown error occurred in GET fetchProductsByCategory");
    }
  },
);

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("An unknown error occurred in GET");
    }
  },
);

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    filterProducts: (state, action) => {
      state.products = state.products.filter((product) => product.categoryId === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Не удалось загрузить продукты";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Не удалось загрузить продукты категории";
      });
  },
});

export const { filterProducts } = productSlice.actions;

export default productSlice.reducer;
