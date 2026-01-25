export interface ProductVariant {
  id: number;
  size: string;
  price: number;
}

export interface Ingredient {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
}

export interface ProductIngredient {
  id: number;
  ingredient: Ingredient;
  isDefault: boolean;
  isRemovable: boolean;
  isExtra: boolean;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  basePrice: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  ingredients: ProductIngredient[];
  createdAt: string;
  updatedAt: string;
}
