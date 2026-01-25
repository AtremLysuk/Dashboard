import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

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
