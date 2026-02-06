import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { generateSlug } from "@/utils/generateSlug";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let whereClause: any = {};

    if (category && category !== "Все") {
      whereClause.category = {
        name: category,
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: {
          select: {
            id: true,
            size: true,
            price: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
              },
            },
          },
          where: {
            ingredient: {
              isActive: true,
            },
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.title || data.title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!data.variants || !Array.isArray(data.variants) || data.variants.length === 0) {
      return NextResponse.json({ error: "At least one variant is required" }, { status: 400 });
    }

    if (!data.categoryId || isNaN(parseInt(data.categoryId))) {
      return NextResponse.json({ error: "Valid categoryId is required" }, { status: 400 });
    }

    const categoryId = parseInt(data.categoryId);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: generateSlug(data.title),
        description: data.description || "",
        imageUrl: data.imageUrl || "/default.png",
        categoryId: categoryId,
      },
    });

    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: variant.size,
            price: parseFloat(variant.price),
          },
        });
      }
    }

    if (data.ingredients && data.ingredients.length > 0) {
      for (const ing of data.ingredients) {
        await prisma.productIngredient.create({
          data: {
            productId: product.id,
            ingredientId: ing.ingredientId,
            isDefault: ing.isDefault ?? true,
            isRemovable: ing.isRemovable ?? true,
            isExtra: ing.isExtra ?? false,
          },
        });
      }
    }

    return NextResponse.json({ success: true, productId: product.id });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Product created partially. Check data." }, { status: 500 });
  }
}
