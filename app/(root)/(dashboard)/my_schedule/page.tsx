"use client";

import { MeetingsSchedule } from "@/components/meetings-schedule";
import { NewMeeting } from "@/components/new-meeting";
import { meetingDataTypes } from "@/lib/types";
import {
  Days,
  convertTimeFormat,
  getDay,
  getDayReference,
  getMonth,
  getYear,
} from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<meetingDataTypes[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await axios.get("/api/schedule");
      const data = response.data.map((day: any) => {
        return {
          dayReference: getDayReference(day),
          day: Days[new Date(day.date).getDay()],
          date: `${getMonth(day)} ${getDay(day)}, ${getYear(day)}`,
          times: day.meetings.map((meeting: any) => {
            return {
              id: meeting.id,
              startTime: convertTimeFormat(meeting.startTime),
              endTime: convertTimeFormat(meeting.endTime),
              title: meeting.topic,
              breakTime: meeting.breakTime,
              guestName: meeting?.booking?.guestName,
            };
          }),
        };
      });
      setData(data);
    };

    fetchMeetings();
  }, []);

  return (
    <div>
      <MeetingsSchedule sideComponent={<NewMeeting />} data={data} />
    </div>
  );
};

export default Page;
