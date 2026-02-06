"use client";

import clsx from "clsx";
import styles from "./ProductItem.module.scss";
import Image from "next/image";
import type { Product } from "../../../types/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UpdateProductModal } from "@/components/UpdateProductModal";
import { useState } from "react";

type ProductVariant = {
  id: number;
  size: string;
  price: string;
};

type Props = {
  className?: string;
  product: Product;
};

export default function ProductItem({ className, product }: Props) {
  const { id, ingredients, title, variants, imageUrl } = product;

  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const productIngredients = [...ingredients];
  const router = useRouter();

  const onDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Fail delete product with id");
      }

      const data = await res.json();

      console.log(data);
      toast.success(`Product deleted successfully!`);
      router.refresh();

      return data;
    } catch (error) {
      console.log(error);
      toast.error(`Fail delete product with id: ${id}`);
    }
  };

  console.log(variants);

  return (
    <article className={clsx(styles.root, className)}>
      <div className={styles.inner}>
        <Image
          className={styles.image}
          src={imageUrl}
          alt={`Card of ${title}`}
          width={80}
          height={80}
        />
        <div className={styles.productContent}>
          <h2 className={styles.title}>{title}</h2>
          <span>{id}</span>
          {variants.map((variant) => (
            <div className={styles.variantInner} key={variant.size}>
              <span>{`Size: ${variant.size}`}</span>
              <span>{`Price: ${variant.price}`}</span>
            </div>
          ))}
        </div>
        <div className={styles.buttons}>
          <button className={styles.editBtn} type="button">
            Edit
          </button>
          <button
            className={styles.deleteBtn}
            type="button"
            onClick={() => onDeleteProduct(id.toString())}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
