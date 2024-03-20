"use client";

import { MeetingDetails } from "@/components/meeting-details";
import { MeetingsSchedule } from "@/components/meetings-schedule";
import { meetingDataTypes } from "@/lib/types";
import {
  Days,
  convertTimeFormat,
  getDayReference,
  getDay,
  getMonth,
  getYear,
} from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

const Page = ({ params }: { params: { userId: string } }) => {
  const [data, setData] = useState<meetingDataTypes[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await axios.get("/api/meetings/" + params.userId);
      const data = response.data.map((day: any) => {
        return {
          dayReference: getDayReference(day),
          day: Days[new Date(day.date).getDay()],
          hostName: day.userName,
          date: `${getMonth(day)} ${getDay(day)}, ${getYear(day)}`,
          times: day.meetings.map((meeting: any) => {
            return {
              id: meeting.id,
              startTime: convertTimeFormat(meeting.startTime),
              endTime: convertTimeFormat(meeting.endTime),
              breakTime: meeting.breakTime,
              title: meeting.topic,
              bookingId: meeting?.booking?.id,
              userId: meeting?.booking?.userId,
              guestName: meeting?.booking?.guestName,
            };
          }),
          booked:
            day.meetings.filter((meeting: any) => meeting.booking).length >=
            day.maxMeetings,
        };
      });
      setData(data);
    };

    fetchMeetings();
  }, [params.userId]);

  return (
    <div>
      <MeetingsSchedule
        data={data}
        sideComponent={<MeetingDetails hostName={data[0]?.hostName} />}
      />
    </div>
  );
};

export default Page;
