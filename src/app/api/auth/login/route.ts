import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-super-secret-key-min-32-chars";

if (!process.env.NEXTAUTH_SECRET) {
  console.error("NEXTAUTH_SECRET is not set in environment variables");
}

async function signJWT(payload: {
  id: string;
  email: string;
  name: string | null;
  role: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (error, token) => {
      if (error) reject(error);
      resolve(token!);
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Аккаунт зарегистрирован через Google. Используйте вход через Google." },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const token = await signJWT({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Вход выполнен успешно",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.log("Login error:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервер" }, { status: 500 });
  }
}
