import { ReactNode, createContext, useState } from "react";

type valueType = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hostName: string;
  booked?: boolean;
  topic?: string;
  guestName?: string;
};

export interface TimeContextProps {
  value: valueType;
  updateValue: (value: valueType) => void;
}
export const TimeContext = createContext<TimeContextProps | undefined>(
  undefined
);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState<valueType>({
    id: "",
    date: "",
    startTime: "",
    endTime: "",
    hostName: "Anonymous",
    guestName: "",
  });

  const updateValue = (value: valueType) => {
    setValue(value);
  };

  return (
    <TimeContext.Provider value={{ value, updateValue }}>
      {children}
    </TimeContext.Provider>
  );
};
