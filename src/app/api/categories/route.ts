import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const allCategories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            ingredients: true,
            variants: true,
          },
        },
      },
    });
    return NextResponse.json(allCategories, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
