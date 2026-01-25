import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(res: NextResponse, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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
