import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const users: { userId: string; userName: string }[] = [];

    const days = await prismadb.day.findMany({});

    if (!days) {
      return new NextResponse("No users found", { status: 404 });
    }

    days.map((day) => {
      if (
        !users.find((user) => user.userId === day.userId) &&
        day.userId !== userId
      ) {
        users.push({ userId: day.userId, userName: day.userName });
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
