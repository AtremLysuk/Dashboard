"use client";
import clsx from "clsx";
import styles from "./Products.module.scss";
import { fetchProducts, fetchProductsByCategory } from "@/redux/slices/productSlice";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProductItem } from "@/components/ProductItem";
import MyLoading from "@/components/shared/MyLoading/MyLoading";

type Category = {
  name: string;
  categoryId: number;
};

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>({ name: "Все", categoryId: 0 });
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.products);

  const categories: Category[] = [
    {
      name: "Все",
      categoryId: 0,
    },
    {
      name: "Пиццы",
      categoryId: 1,
    },
    {
      name: "Напитки",
      categoryId: 2,
    },
    {
      name: "Завтраки",
      categoryId: 3,
    },
    {
      name: "Десерты",
      categoryId: 4,
    },
  ];

  const onChangeCategory = (category: Category) => {
    setActiveCategory(category);
    if (category.name === "Все") {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProductsByCategory(category.categoryId));
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  console.log("Products from Redux:", products);

  return (
    <section className={clsx(styles.root)} aria-labelledby="products-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="products-title">Products</h2>
          <nav className={styles.categoriesMenu}>
            <ul className={styles.categoriesList}>
              {categories.map((category) => (
                <li className={styles.categoriesItem} key={category.name}>
                  <button
                    className={clsx(
                      styles.categoryBtn,
                      category.name === activeCategory.name && styles.categoryBtnActive,
                    )}
                    onClick={() => {
                      onChangeCategory(category);
                      console.log("activeCategory:", activeCategory);
                    }}
                    type="button"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {status === "pending" && (
          <div className={styles.loading}>
            <MyLoading />
          </div>
        )}

        {status === "rejected" && (
          <div className={styles.error}>
            <p>Error: {error}</p>
            <button onClick={() => dispatch(fetchProducts())}>Retry</button>
          </div>
        )}

        {status === "success" && products.length > 0 && (
          <ul className={styles.products}>
            {products.map((product) => (
              <li className={styles.productsItem} key={product.id}>
                <ProductItem product={product} />
              </li>
            ))}
          </ul>
        )}

        {status === "success" && products.length === 0 && (
          <div className={styles.empty}>
            <p>No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
