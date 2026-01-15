import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(res: NextResponse) {
  try {
    const orders = await prisma.order.findMany();
    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "unknown error",
      },
      { status: 500 },
    );
  }
}
