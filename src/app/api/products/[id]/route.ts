import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Неверный ID продукта" }, { status: 400 });
    }

    const productId = Number(id);
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const deletedProduct = await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Неверный ID продукта" }, { status: 400 });
    }

    const data = await req.json();
    const productId = Number(id);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      },
    });

    if (data.variants) {
      await prisma.productVariant.deleteMany({
        where: { productId },
      });

      for (const variant of data.variants) {
        await prisma.productVariant.create({
          data: {
            productId,
            size: variant.size,
            price: variant.price,
          },
        });
      }
    }

    if (data.ingredients) {
      await prisma.productIngredient.deleteMany({
        where: { productId },
      });

      for (const ingredient of data.ingredients) {
        await prisma.productIngredient.create({
          data: {
            productId,
            ingredientId: data.ingredientId,
            isDefault: ingredient.isDefault,
            isRemovable: ingredient.isRemovable,
            isExtra: ingredient.isExtra,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
  }
}
