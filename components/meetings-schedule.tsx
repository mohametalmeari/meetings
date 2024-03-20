"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { FiveDaysSchedule } from "./five-days-schedule";
import { ReactNode, useState } from "react";
import { TimeProvider } from "@/providers/time-provider";
import { Button } from "./ui/button";
import { meetingDataTypes } from "@/lib/types";

export const MeetingsSchedule = ({
  data,
  sideComponent,
}: {
  data: meetingDataTypes[];
  sideComponent?: ReactNode;
}) => {
  const [index, setIndex] = useState(0);

  return (
    <TimeProvider>
      <div className="flex bg-white rounded-md shadow-sm h-[30rem]">
        <div className="flex flex-col flex-1 p-5 border-r-2">
          {sideComponent}
        </div>

        <div className="flex flex-col flex-[2]">
          <div className="flex items-center justify-between p-2 border-b-2 text-blue-500 h-10">
            <div>
              {index > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIndex(index - 1);
                  }}
                  className="flex justify-center items-center gap-2"
                >
                  <ArrowLeftIcon width={18} />
                  <span>Previous</span>
                </Button>
              )}
            </div>
            <div>
              {5 + 5 * index < data.length && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                  className="flex justify-center items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRightIcon width={18} />
                </Button>
              )}
            </div>
          </div>
          {data.length ? (
            <FiveDaysSchedule
              props={data.slice(0 + 5 * index, 5 + 5 * index)}
            />
          ) : (
            <div className="flex items-center justify-center h-20">
              <span className="text-gray-400">No meetings found</span>
            </div>
          )}
        </div>
      </div>
    </TimeProvider>
  );
};
