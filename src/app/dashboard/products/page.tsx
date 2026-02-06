// "use client";
// import clsx from "clsx";
// import styles from "./Products.module.scss";
// import { fetchProducts, fetchProductsByCategory } from "@/redux/slices/productSlice";
// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { ProductItem } from "@/components/ProductItem";
// import MyLoading from "@/components/shared/MyLoading/MyLoading";
// import { CreateProductModal } from "@/components/CreateProductModal";
//
// type Category = {
//   name: string;
//   categoryId: number;
// };
//
// export default function ProductsPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeCategory, setActiveCategory] = useState<Category>({ name: "Все", categoryId: 0 });
//   const dispatch = useAppDispatch();
//   const { products, status, error } = useAppSelector((state) => state.products);
//
//   const categories: Category[] = [
//     {
//       name: "Все",
//       categoryId: 0,
//     },
//     {
//       name: "Пиццы",
//       categoryId: 1,
//     },
//     {
//       name: "Напитки",
//       categoryId: 2,
//     },
//     {
//       name: "Завтраки",
//       categoryId: 3,
//     },
//     {
//       name: "Десерты",
//       categoryId: 4,
//     },
//   ];
//
//   const onChangeCategory = (category: Category) => {
//     setActiveCategory(category);
//     if (category.name === "Все") {
//       dispatch(fetchProducts());
//     } else {
//       dispatch(fetchProductsByCategory(category.categoryId));
//     }
//   };
//
//   const onModalClose = () => {
//     if (!isOpen) return;
//     setIsOpen(false);
//   };
//
//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);
//
//   if (isOpen)
//     return <CreateProductModal isOpen={isOpen} onClose={onModalClose} categories={categories} />;
//
//   return (
//     <section className={clsx(styles.root)} aria-labelledby="products-title">
//       <div className={styles.inner}>
//         <header className={styles.header}>
//           <div className={styles.headerInner}>
//             <h2 id="products-title">Products</h2>
//             <button
//               type="button"
//               className={styles.createProductBtn}
//               onClick={() => {
//                 setIsOpen((prev) => !prev);
//               }}
//             >
//               <span>Create new Product</span>
//             </button>
//           </div>
//
//           <nav className={styles.categoriesMenu}>
//             <ul className={styles.categoriesList}>
//               {categories.map((category) => (
//                 <li className={styles.categoriesItem} key={category.name}>
//                   <button
//                     className={clsx(
//                       styles.categoryBtn,
//                       category.name === activeCategory.name && styles.categoryBtnActive,
//                     )}
//                     onClick={() => {
//                       onChangeCategory(category);
//                     }}
//                     type="button"
//                   >
//                     {category.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </header>
//
//         {status === "pending" && (
//           <div className={styles.loading}>
//             <MyLoading />
//           </div>
//         )}
//
//         {status === "rejected" && (
//           <div className={styles.error}>
//             <p>Error: {error}</p>
//             <button onClick={() => dispatch(fetchProducts())}>Retry</button>
//           </div>
//         )}
//
//         {status === "success" && products.length > 0 && (
//           <ul className={styles.products}>
//             {products.map((product) => (
//               <li className={styles.productsItem} key={product.id}>
//                 <ProductItem product={product} />
//               </li>
//             ))}
//           </ul>
//         )}
//
//         {status === "success" && products.length === 0 && (
//           <div className={styles.empty}>
//             <p>No products found</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";
import clsx from "clsx";
import styles from "./Products.module.scss";
import { fetchProducts, fetchProductsByCategory } from "@/redux/slices/productSlice";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProductItem } from "@/components/ProductItem";
import MyLoading from "@/components/shared/MyLoading/MyLoading";
import { ProductModal } from "@/components/ProductModal";

type Category = {
  name: string;
  categoryId: number;
};

export default function ProductsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    if (activeCategory.name === "Все") {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProductsByCategory(activeCategory.categoryId));
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <section className={clsx(styles.root)} aria-labelledby="products-title">
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <h2 id="products-title">Products</h2>
              <button
                type="button"
                className={styles.createProductBtn}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <span>Create new Product</span>
              </button>
            </div>

            <nav className={styles.categoriesMenu}>
              <ul className={styles.categoriesList}>
                {categories.map((category) => (
                  <li className={styles.categoriesItem} key={category.name}>
                    <button
                      className={clsx(
                        styles.categoryBtn,
                        category.name === activeCategory.name && styles.categoryBtnActive,
                      )}
                      onClick={() => onChangeCategory(category)}
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
                  <ProductItem product={product} categories={categories.slice(1)} />
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

      {/* Модалка для создания продукта */}
      <ProductModal
        isOpen={isCreateModalOpen}
        mode="create"
        categories={categories.slice(1)} // Исключаем "Все"
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
