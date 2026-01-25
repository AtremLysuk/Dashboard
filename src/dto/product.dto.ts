import { ProductVariantDTO, mapVariantToDTO } from "./product-variant.dto";

export type ProductDTO = {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  variants: ProductVariantDTO[];
};

export function mapProductToDTO(product: any): ProductDTO {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    imageUrl: product.imageUrl,
    variants: product.variants.map(mapVariantToDTO),
  };
}
