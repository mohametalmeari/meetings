"use client";

import { meetingDataTypes } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TimeContext, TimeContextProps } from "@/providers/time-provider";
import { useUser } from "@clerk/nextjs";
import { ChevronsDownIcon, ClockIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Fragment, useContext } from "react";

export const DayTimes = ({ props }: { props: meetingDataTypes }) => {
  const { updateValue, value } = useContext(TimeContext) as TimeContextProps;
  const { user } = useUser();
  const { userId: hostId } = useParams();

  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      {props.times.map((item) => (
        <Fragment key={item.startTime}>
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-400 bg-gray-100",
              !item.bookingId &&
                !props.booked &&
                "bg-blue-50 text-blue-600 hover:cursor-pointer hover:ring-2 hover:ring-blue-400",
              props.date === value.date &&
                item.startTime === value.startTime &&
                item.endTime === value.endTime &&
                "ring-2 ring-blue-500",
              item.guestName &&
                (item.userId === user?.id || !hostId) &&
                "bg-green-50 text-green-600 hover:cursor-pointer hover:ring-2 hover:ring-blue-400"
            )}
            onClick={() => {
              if (
                (!item.bookingId && !props.booked) ||
                item.userId === user?.id
              ) {
                if (
                  item.startTime === value.startTime &&
                  props.date === value.date
                ) {
                  updateValue({
                    id: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    hostName: "Anonymous",
                    booked: false,
                    topic: "",
                    guestName: "",
                  });
                } else {
                  updateValue({
                    id: item.id,
                    date: props.date,
                    hostName: props.hostName,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    booked: item.bookingId ? true : false,
                    topic: item.title,
                    guestName: item.guestName,
                  });
                }
              }
            }}
          >
            <span>{item.startTime}</span>
            <ChevronsDownIcon className="h-4 w-4" />
            <span>{item.endTime}</span>
          </div>
          {item.breakTime && item.breakTime !== "0" && (
            <div className="flex flex-col items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-red-500 bg-red-50">
              <span className="flex justify-center items-center gap-1">
                00:{item.breakTime}
                <ClockIcon size={20} />
              </span>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};
