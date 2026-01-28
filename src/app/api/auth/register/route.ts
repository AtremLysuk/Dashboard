import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email та пароль обов'язкові" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль повинен містити мінімум 6 символів" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Користувач з таким email вже існує" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || normalizedEmail.split("@")[0],
        passwordHash,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Користувач успішно створений",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Помилка при реєстрації" }, { status: 500 });
  }
}
