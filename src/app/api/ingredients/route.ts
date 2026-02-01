import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany();

    return NextResponse.json(ingredients);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ingredients" },
      { status: 500 },
    );
  }
}
