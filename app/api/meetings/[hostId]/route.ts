import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { hostId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { meetingId, guestName } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const meeting = await prismadb.meeting.findFirst({
      where: { id: meetingId, day: { userId: params.hostId } },
      include: { day: true },
    });

    if (!meeting) {
      return new NextResponse("Meeting not found", { status: 404 });
    }

    const TotalMeetingsPerDay = await prismadb.meeting.count({
      where: { dayId: meeting.dayId },
    });

    const AvailableMeetingsPerDay = await prismadb.meeting.count({
      where: { dayId: meeting.dayId, booking: null },
    });

    const BookedMeetingsPerDay = TotalMeetingsPerDay - AvailableMeetingsPerDay;

    if (BookedMeetingsPerDay >= parseInt(meeting.day.maxMeetings)) {
      return new NextResponse("Day is full", { status: 400 });
    }

    const booking = await prismadb.booking.create({
      data: {
        userId,
        meetingId,
        guestName: guestName,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("[SCHEDULE_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { hostId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = await prismadb.day.findMany({
      where: {
        userId: params.hostId,
        date: { gte: today },
        meetings: { some: {} },
      },
      include: { meetings: { include: { booking: true } } },
    });

    days.forEach((day) => {
      day.meetings.sort(
        (a, b) =>
          new Date(`1970/01/01 ${a.startTime}`).getTime() -
          new Date(`1970/01/01 ${b.startTime}`).getTime()
      );
    });

    days.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(days);
  } catch (error) {
    console.log("[SCHEDULE_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
