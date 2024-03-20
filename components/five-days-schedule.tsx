import { meetingDataTypes } from "@/lib/types";
import { Day } from "./day";
import { DayTimes } from "./day-times";

export const FiveDaysSchedule = ({ props }: { props: meetingDataTypes[] }) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="grid grid-cols-5 py-3 border-b-2 h-[6rem]">
        {props.map((item) => (
          <Day key={item.date} props={item} />
        ))}
      </div>
      <div className="grid grid-cols-5 py-5 flex-1 overflow-y-scroll no-scrollbar">
        {props.map((item) => (
          <DayTimes
            key={item.date}
            props={{
              date: item.date,
              hostName: item.hostName,
              times: item.times,
              booked: item.booked,
              day: "",
            }}
          />
        ))}
      </div>
    </div>
  );
};
