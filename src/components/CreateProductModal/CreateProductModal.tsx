"use client";

import clsx from "clsx";
import styles from "./CreateProductModal.module.scss";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { MyIcon } from "@/components/icons/MyIcon";

const createProductSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string(),
  categoryId: z.string().min(1, "Please select a category"),

  variants: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        price: z.string().min(1, "Price is required"),
      }),
    )
    .min(1, "At least one variant is required"),

  ingredients: z.array(
    z.object({
      ingredientId: z.string().min(1, "Ingredient is required"),
      isDefault: z.literal(true),
      isRemovable: z.literal(true),
      isExtra: z.literal(false),
    }),
  ),
  imageUrl: z.string().optional(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

type Ingredient = {
  id: number;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Props = {
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  categories?: Category[];
};

export default function CreateProductModal({
  className,
  isOpen,
  onClose,
  onSuccess,
  categories = [],
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingIngredients, setLoadingIngredients] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setFocus,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateProductFormData>({
    mode: "onChange",
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      variants: [{ size: "", price: "" }],
      ingredients: [],
      imageUrl: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setValue("imageUrl", result.url);
        alert("Image uploaded successfully!");
      } else {
        alert(result.error || "Upload failed");
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchIngredients = async () => {
        setLoadingIngredients(true);
        try {
          const res = await fetch("/api/ingredients");

          if (!res.ok) {
            throw new Error("Failed to fetch in component");
          }

          const data = await res.json();

          setIngredients(data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoadingIngredients(false);
        }
      };

      fetchIngredients();
    }
  }, []);
  console.log("ingredients", ingredients);
  const onSubmit: SubmitHandler<CreateProductFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const productData = {
        title: data.title,
        description: data.description || "",
        categoryId: parseInt(data.categoryId),
        imageUrl: data.imageUrl || "/default-product.png",
        variants: data.variants.map((variant) => ({
          size: variant.size,
          price: parseFloat(variant.price),
        })),
        ingredients: data.ingredients.map((ingredient) => ({
          ingredientId: parseInt(ingredient.ingredientId),
          isDefault: ingredient.isDefault,
          isRemovable: ingredient.isRemovable,
          isExtra: ingredient.isExtra,
        })),
      };
      console.log("Creating product:", productData);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Product created successfully!");
        reset();
        setPreviewImage(null);
        onSuccess?.();
      } else {
        alert(result.error || "Failed to create product");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={clsx(styles.root, className)}
      role="dialog"
      aria-labelledby="modalTitle"
      aria-modal={true}
    >
      <div className={styles.wrapper}>
        <button className={styles.closeBtn} type="button" onClick={onClose}>
          <MyIcon name="close" size={40} color="gray" />
        </button>
        <h1 className={styles.title} id="modalTitle">
          Create new product
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Enter product title</label>
            <div className={styles.inputWrapper}>
              <input
                {...register("title")}
                type="text"
                name="title"
                id="title"
                aria-invalid={errors.title ? true : false}
                disabled={isSubmitting}
              />
            </div>
            {errors?.title && <span className={styles.error}>{errors.title.message}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <div className={styles.inputWrapper}>
              <textarea
                {...register("description")}
                id="description"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            {errors?.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="categoryId">Select category</label>
            <div className={styles.inputWrapper}>
              <select
                {...register("categoryId")}
                name="categoryId"
                id="categoryId"
                disabled={isSubmitting || categories?.length === 0}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={`${category.name}${category.id}`} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errors?.categoryId && (
              <span className={styles.error}>{errors.categoryId.message}</span>
            )}
            {categories?.length === 0 && <p>No categories available</p>}
          </div>

          {/*VARIANTS*/}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Variants *</h2>
              <button
                type="button"
                className={styles.addVariantButton}
                onClick={() => appendVariant({ size: "", price: "" })}
                disabled={isSubmitting}
              >
                + Add Variant
              </button>
            </div>

            {variantFields.map((field, index) => (
              <div key={field.id} className={styles.variantRow}>
                <div className={styles.variantInput}>
                  <input
                    {...register(`variants.${index}.size`)}
                    placeholder="Size (e.g., Small, Medium)"
                    className={clsx(
                      styles.input,
                      errors.variants?.[index]?.size && styles.inputError,
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.variants?.[index]?.size && (
                    <span className={styles.error}>{errors.variants[index]?.size?.message}</span>
                  )}
                </div>

                <div className={styles.variantInput}>
                  <input
                    {...register(`variants.${index}.price`)}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    className={clsx(
                      styles.input,
                      errors.variants?.[index]?.price && styles.inputError,
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.variants?.[index]?.price && (
                    <span className={styles.error}>{errors.variants[index]?.price?.message}</span>
                  )}
                </div>

                {variantFields.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeVariantButton}
                    onClick={() => removeVariant(index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {errors.variants?.message && (
              <span className={styles.error}>{errors.variants.message}</span>
            )}
          </div>

          {/*.........IMAGE........*/}

          <div className={styles.inputGroup}>
            <label htmlFor="image">Product Image</label>
            <div className={styles.inputWrapper}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting || isUploading}
                id="image"
              />
              {isUploading && <span>...Uploading</span>}
            </div>
            {previewImage && (
              <div className={styles.imagePreview}>
                <img src={previewImage} alt="Preview" className={styles.previewImage} width={150} />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setValue("imageUrl", "");
                  }}
                  className={styles.removeImageBtn}
                >
                  Remove
                </button>
              </div>
            )}
            <input type="hidden" {...register("imageUrl")} />
            {errors?.imageUrl && <span className={styles.error}>{errors?.imageUrl.message}</span>}
          </div>

          <div className={styles.buttons}>
            <button className={styles.submitBtn} type="submit">
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
            <button className={styles.submitBtn} type="reset" onClick={() => reset()}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
