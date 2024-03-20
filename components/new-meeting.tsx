"use client";

import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { MeetingDetails } from "./meeting-details";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { TimeContext, TimeContextProps } from "@/providers/time-provider";

export const NewMeeting = () => {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [breakTime, setBreakTime] = useState("0");
  const [topic, setTopic] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [maxMeetings, setMaxMeetings] = useState("24");

  const { value } = useContext(TimeContext) as TimeContextProps;

  const { user } = useUser();
  const hostName = user?.fullName || "Anonymous";

  const validateInputs = () => {
    setError("Invalid inputs");
    if (!date) {
      return false;
    }

    const startTimeInMinutes =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);
    const endTimeInMinutes =
      parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
    if (startTimeInMinutes >= endTimeInMinutes && endTimeInMinutes !== 0) {
      return false;
    }
    setError("");
    return true;
  };

  const handleSchedule = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      setDisabled(true);
      setError("");
      const response = await axios.post("/api/schedule", {
        date: date?.toISOString(),
        startTime,
        endTime,
        breakTime,
        topic,
        hostName,
        maxMeetings,
      });
      window.location.reload();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setError("Invalid time range!");
      } else {
        setError("Something went wrong!");
      }
    } finally {
      setDisabled(false);
    }
  };

  const handelDeleteMeeting = async () => {
    try {
      setDisabled(true);
      const response = await axios.delete("/api/schedule", {
        data: { meetingId: value.id },
      });
      window.location.reload();
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {creating ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-10 items-center">
            <h2>Schedule new meeting</h2>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal h-10 w-full",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between text-gray-600">
            <label className="flex flex-col">
              <span className="text-sm text-gray-500">From:</span>
              <input
                className="ring-1 ring-gray-200 rounded-sm px-4 h-10"
                type="time"
                step="60"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-500">To:</span>
              <input
                className="ring-1 ring-gray-200 rounded-sm  px-4 h-10"
                type="time"
                step="60"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
              />
            </label>
          </div>
          <label className="flex flex-col">
            <span className="text-sm text-gray-500">
              Break between meetings:
            </span>
            <div className="relative">
              <input
                className="ring-1 ring-gray-200 rounded-sm  px-4 h-10 w-full"
                type="number"
                step="5"
                value={breakTime}
                onChange={(e) => {
                  if (
                    parseInt(e.target.value) >= 0 &&
                    parseInt(e.target.value) <= 60
                  ) {
                    setBreakTime(e.target.value);
                  } else if (e.target.value === "") {
                    setBreakTime("0");
                  }
                }}
              />
              <span className="absolute right-0 bottom-[%50] translate-y-[50%] mr-4 text-sm text-gray-400">
                Minutes
              </span>
            </div>
          </label>
          <div>
            <label className="flex flex-col">
              <span className="text-sm text-gray-500">Topic:</span>
              <input
                className="ring-1 ring-gray-200 rounded-sm  px-4 h-10 w-full"
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                }}
              />
            </label>
          </div>
          <label className="flex flex-col">
            <span className="text-sm text-gray-500">
              Maximum meetings per day:
            </span>
            <div className="relative">
              <input
                className="ring-1 ring-gray-200 rounded-sm  px-4 h-10 w-full"
                type="number"
                step="1"
                value={maxMeetings}
                onChange={(e) => {
                  if (
                    parseInt(e.target.value) >= 0 &&
                    parseInt(e.target.value) <= 24
                  ) {
                    setMaxMeetings(e.target.value);
                  } else if (e.target.value === "") {
                    setMaxMeetings("0");
                  }
                }}
              />
              <span className="absolute right-0 bottom-[%50] translate-y-[50%] mr-4 text-sm text-gray-400">
                Meetings / Day
              </span>
            </div>
          </label>
          <div className="flex gap-5">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setCreating(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handleSchedule}
              disabled={disabled}
            >
              Schedule
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <MeetingDetails hostName={hostName} />
          <div className="w-full flex gap-5">
            <Button
              className="flex-[2]"
              variant="destructive"
              onClick={() => {
                handelDeleteMeeting();
              }}
              disabled={value.id === "" || disabled}
            >
              Delete Meeting
            </Button>
            <Button
              className="flex-[3]"
              onClick={() => {
                setCreating(true);
              }}
            >
              Schedule Meeting
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
