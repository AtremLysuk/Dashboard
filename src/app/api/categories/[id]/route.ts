import { prisma } from "../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const categoryId = parseInt(id);
    const productsById = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },

      include: {
        ingredients: true,
        variants: true,
      },
    });

    return NextResponse.json(productsById, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
