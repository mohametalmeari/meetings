import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const {
      topic,
      date,
      startTime,
      endTime,
      breakTime,
      hostName,
      maxMeetings,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(date) < today) {
      return new NextResponse("Invalid date", { status: 400 });
    }

    const dayByDate = await prismadb.day.findFirst({
      where: { userId, date },
    });
    if (!dayByDate) {
      await prismadb.day.create({
        data: {
          userId,
          date,
          userName: hostName,
          maxMeetings,
        },
      });
    }

    const day = await prismadb.day.findFirst({
      where: { userId, date },
      include: { meetings: true },
    });

    if (!day) {
      return new NextResponse("Day not found", { status: 404 });
    }

    if (day.maxMeetings !== maxMeetings) {
      await prismadb.day.update({
        where: { id: day.id },
        data: { maxMeetings },
      });
    }

    const convertDate = (time: string, breakTime: string = "0") => {
      const [hours, minutes] = time.split(":");
      const currentDate = new Date(0);

      currentDate.setHours(Number(hours));
      currentDate.setMinutes(Number(minutes) + Number(breakTime));

      return currentDate;
    };

    if (
      convertDate(startTime).getTime() + 7200000 >
        convertDate(endTime).getTime() + 7200000 &&
      convertDate(endTime).getTime() + 7200000 !== 0
    ) {
      return new NextResponse("Invalid time", { status: 400 });
    }

    let meetingConflict = false;

    day.meetings.forEach(async (meeting) => {
      if (userId === day.userId) {
        const meetingStartTime = convertDate(meeting.startTime).getTime();
        const meetingEndTime = convertDate(
          meeting.endTime,
          meeting.breakTime
        ).getTime();
        const inputStartTime = convertDate(startTime).getTime();
        const inputEndTime = convertDate(endTime, breakTime).getTime();
        if (
          (inputStartTime >= meetingStartTime &&
            inputStartTime < meetingEndTime) ||
          (inputEndTime > meetingStartTime && inputEndTime <= meetingEndTime)
        ) {
          meetingConflict = true;
        }
      }
    });

    if (meetingConflict) {
      return new NextResponse("Meeting conflict", { status: 409 });
    }

    const meeting = await prismadb.meeting.create({
      data: {
        dayId: day.id,
        topic,
        startTime,
        endTime,
        breakTime,
      },
    });
    return NextResponse.json(meeting);
  } catch (error) {
    console.log("[SCHEDULE_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { meetingId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const meetingByUser = await prismadb.meeting.findFirst({
      where: { id: meetingId, day: { userId } },
    });

    if (!meetingByUser) {
      return new NextResponse("Meeting not found", { status: 404 });
    }

    const meeting = await prismadb.meeting.delete({
      where: { id: meetingId },
    });
    return NextResponse.json(meeting);
  } catch (error) {
    console.log("[SCHEDULE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(_req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = await prismadb.day.findMany({
      where: {
        userId,
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
