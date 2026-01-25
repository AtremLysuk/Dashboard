import { ProductDTO, mapProductToDTO } from "./product.dto";

export type CategoryDTO = {
  id: number;
  name: string;
  slug: string;
  order: number;
  products: ProductDTO[];
};

export function mapCategoryToDTO(category: any): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    order: category.order,
    products: category.products.map(mapProductToDTO),
  };
}
