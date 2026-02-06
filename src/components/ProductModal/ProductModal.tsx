"use client";

import clsx from "clsx";
import styles from "./ProductModal.module.scss";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { IngredientsModal } from "@/components/IngredientsModal";
import { toast } from "sonner";

// Общая схема валидации
const productSchema = z.object({
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
      isDefault: z.boolean(),
      isRemovable: z.boolean(),
      isExtra: z.boolean(),
    }),
  ),
  imageUrl: z.string().optional(),
});

type ProductFormData = {
  title: string;
  description: string;
  categoryId: string;
  variants: Array<{
    size: string;
    price: string;
  }>;
  ingredients: Array<{
    ingredientId: string;
    isDefault: boolean;
    isRemovable: boolean;
    isExtra: boolean;
  }>;
  imageUrl?: string;
};

type Ingredient = {
  id: number;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
};

type Category = {
  categoryId: number;
  name: string;
};

type ProductVariant = {
  id: number;
  size: string;
  price: number;
};

type Product = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  variants: ProductVariant[];
  ingredients: {
    ingredientId: number;
    ingredient: Ingredient;
    isDefault: boolean;
    isRemovable: boolean;
    isExtra: boolean;
  }[];
};

type Props = {
  className?: string;
  isOpen: boolean;
  mode?: "create" | "edit";
  product?: Product | null;
  onClose?: () => void;
  onSuccess?: () => void;
  categories?: Category[];
};

export default function ProductModal({
  className,
  isOpen,
  mode = "create",
  product = null,
  onClose,
  onSuccess,
  categories = [],
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingIngredients, setLoadingIngredients] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    mode: "onChange",
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      variants: [{ size: "", price: "" }],
      ingredients: [],
      imageUrl: "",
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  // Инициализация формы данными продукта при редактировании
  useEffect(() => {
    if (mode === "edit" && product && isOpen) {
      const formIngredients = product.ingredients.map((ing) => ({
        ingredientId: ing.ingredient.id.toString(),
        isDefault: ing.isDefault,
        isRemovable: ing.isRemovable,
        isExtra: ing.isExtra,
      }));

      reset({
        title: product.title,
        description: product.description || "",
        categoryId: product.categoryId.toString(),
        variants: product.variants.map((v) => ({
          size: v.size,
          price: v.price.toString(),
        })),
        ingredients: formIngredients,
        imageUrl: product.imageUrl || "/default.png",
      });

      setSelectedIngredients(product.ingredients.map((ing) => ing.ingredient));
      setPreviewImage(product.imageUrl || null);
    } else if (mode === "create" && isOpen) {
      // Сброс формы для создания
      reset({
        title: "",
        description: "",
        categoryId: "",
        variants: [{ size: "", price: "" }],
        ingredients: [],
        imageUrl: "",
      });
      setSelectedIngredients([]);
      setPreviewImage(null);
    }
  }, [mode, product, isOpen, reset]);

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
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Загрузка всех ингредиентов
  useEffect(() => {
    if (isOpen) {
      const fetchIngredients = async () => {
        setLoadingIngredients(true);
        try {
          const res = await fetch("/api/ingredients");

          if (!res.ok) {
            throw new Error("Failed to fetch ingredients");
          }

          const data = await res.json();
          setIngredients(data);
        } catch (error) {
          console.error("Error:", error);
          toast.error("Failed to load ingredients");
        } finally {
          setLoadingIngredients(false);
        }
      };

      fetchIngredients();
    }
  }, [isOpen]);

  // Синхронизация выбранных ингредиентов с формой
  useEffect(() => {
    const formIngredients = selectedIngredients.map((ingredient) => ({
      ingredientId: ingredient.id.toString(),
      isDefault: true,
      isRemovable: true,
      isExtra: false,
    }));

    setValue("ingredients", formIngredients);
  }, [selectedIngredients, setValue]);

  const handleOpenIngredientsModal = () => {
    setIsIngredientsModalOpen(true);
  };

  const handleIngredientsSelected = (selected: Ingredient[]) => {
    setSelectedIngredients(selected);
    setIsIngredientsModalOpen(false);
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const url = mode === "create" ? "/api/products" : `/api/product/${product?.id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(`Product ${mode === "create" ? "created" : "updated"} successfully!`);

        if (mode === "create") {
          reset();
          setSelectedIngredients([]);
          setPreviewImage(null);
        }

        onSuccess?.();
        onClose?.();
      } else {
        toast.error(result.error || `Failed to ${mode === "create" ? "create" : "update"} product`);
      }
    } catch (error) {
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} product`);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={clsx(styles.root, className)}
        role="dialog"
        aria-labelledby="modalTitle"
        aria-modal={true}
      >
        <div className={styles.wrapper}>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            ✕
          </button>
          <h1 className={styles.title} id="modalTitle">
            {mode === "create" ? "Create new product" : "Edit product"}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.leftColumn}>
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
                        <option
                          key={`${category.name}${category.categoryId}`}
                          value={category.categoryId}
                        >
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
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.inputGroup}>
                  <label htmlFor="image">Product Image</label>
                  <div className={styles.imageUploadArea}>
                    {previewImage ? (
                      <div className={styles.imagePreviewFull}>
                        <img src={previewImage} alt="Preview" className={styles.previewImage} />
                        <div className={styles.imagePreviewActions}>
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setValue("imageUrl", "");
                            }}
                            className={styles.removeImageBtn}
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                          <label className={styles.changeImageBtn}>
                            Change
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isSubmitting || isUploading}
                              id="image"
                              style={{ display: "none" }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.imageUploadPlaceholder}>
                        <label className={styles.uploadLabel}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isSubmitting || isUploading}
                            id="image"
                            style={{ display: "none" }}
                          />
                          <span>Click to upload</span>
                          <span className={styles.uploadHint}>or drag and drop</span>
                        </label>
                        {isUploading && <div className={styles.uploadProgress}>Uploading...</div>}
                      </div>
                    )}
                  </div>
                  <input type="hidden" {...register("imageUrl")} />
                  {errors?.imageUrl && (
                    <span className={styles.error}>{errors?.imageUrl.message}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
              <div className={styles.variantHeader}>
                <h2 className={styles.variantTitle}>Variants *</h2>
                <button
                  type="button"
                  className={styles.addVariantButton}
                  onClick={() => appendVariant({ size: "", price: "" })}
                  disabled={isSubmitting}
                >
                  Add Variant
                </button>
              </div>

              <div className={styles.variantsContainer}>
                {variantFields.map((field, index) => (
                  <div key={field.id} className={styles.variantRow}>
                    <div className={styles.variantInputCompact}>
                      <label>Size</label>
                      <input
                        {...register(`variants.${index}.size`)}
                        placeholder="Small, Medium, Large"
                        className={clsx(
                          styles.input,
                          errors.variants?.[index]?.size && styles.inputError,
                        )}
                        disabled={isSubmitting}
                      />
                      {errors.variants?.[index]?.size && (
                        <span className={styles.error}>
                          {errors.variants[index]?.size?.message}
                        </span>
                      )}
                    </div>

                    <div className={styles.variantInputCompact}>
                      <label>Price</label>
                      <div className={styles.priceInputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          {...register(`variants.${index}.price`)}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className={clsx(
                            styles.input,
                            errors.variants?.[index]?.price && styles.inputError,
                          )}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.variants?.[index]?.price && (
                        <span className={styles.error}>
                          {errors.variants[index]?.price?.message}
                        </span>
                      )}
                    </div>

                    {variantFields.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeVariantButton}
                        onClick={() => removeVariant(index)}
                        disabled={isSubmitting}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors.variants?.message && (
                <span className={styles.error}>{errors.variants.message}</span>
              )}
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
              <label>Ingredients</label>
              <div className={styles.ingredientsSection}>
                <button
                  type="button"
                  className={styles.selectIngredientsButton}
                  onClick={handleOpenIngredientsModal}
                  disabled={isLoadingIngredients || isSubmitting}
                >
                  {selectedIngredients.length > 0
                    ? `Selected ${selectedIngredients.length} ingredients`
                    : "Select Ingredients"}
                </button>

                {selectedIngredients.length > 0 && (
                  <div className={styles.selectedIngredientsPreview}>
                    <div className={styles.selectedIngredientsList}>
                      {selectedIngredients.map((ingredient) => (
                        <div key={ingredient.id} className={styles.selectedIngredientItem}>
                          <span className={styles.selectedIngredientName}>{ingredient.name}</span>
                          <span className={styles.selectedIngredientPrice}>
                            +${ingredient.price}
                          </span>
                          <button
                            type="button"
                            className={styles.removeSelectedIngredient}
                            onClick={() => {
                              setSelectedIngredients((prev) =>
                                prev.filter((ing) => ing.id !== ingredient.id),
                              );
                            }}
                            disabled={isSubmitting}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {errors.ingredients?.message && (
                <span className={styles.error}>{errors.ingredients.message}</span>
              )}
            </div>

            <div className={styles.buttons}>
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={isSubmitting || (mode === "edit" && !isDirty)}
              >
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                    ? "Create Product"
                    : "Update Product"}
              </button>

              <button
                className={styles.resetBtn}
                type="button"
                onClick={() => {
                  if (mode === "create") {
                    reset();
                    setSelectedIngredients([]);
                    setPreviewImage(null);
                  } else {
                    // Для режима редактирования сбрасываем к исходным значениям
                    if (product) {
                      const formIngredients = product.ingredients.map((ing) => ({
                        ingredientId: ing.ingredient.id.toString(),
                        isDefault: ing.isDefault,
                        isRemovable: ing.isRemovable,
                        isExtra: ing.isExtra,
                      }));

                      reset({
                        title: product.title,
                        description: product.description || "",
                        categoryId: product.categoryId.toString(),
                        variants: product.variants.map((v) => ({
                          size: v.size,
                          price: v.price.toString(),
                        })),
                        ingredients: formIngredients,
                        imageUrl: product.imageUrl || "/default.png",
                      });
                      setSelectedIngredients(product.ingredients.map((ing) => ing.ingredient));
                      setPreviewImage(product.imageUrl || null);
                    }
                  }
                }}
                disabled={isSubmitting}
              >
                {mode === "create" ? "Reset" : "Reset Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Модалка выбора ингредиентов */}
      <IngredientsModal
        isOpen={isIngredientsModalOpen}
        onClose={() => setIsIngredientsModalOpen(false)}
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        onSelect={handleIngredientsSelected}
      />
    </>
  );
}
