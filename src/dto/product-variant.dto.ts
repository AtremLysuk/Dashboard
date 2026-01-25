export type ProductVariantDTO = {
  id: number;
  size: string;
  price: number;
};

export function mapVariantToDTO(variant: any): ProductVariantDTO {
  return {
    id: variant.id,
    size: variant.size,
    price: Number(variant.price),
  };
}
