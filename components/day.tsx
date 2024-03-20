export const Day = ({
  props,
}: {
  props: {
    dayReference?: string;
    day: string;
    date: string;
  };
}) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center h-[4.4rem]">
      <div className="flex-1 text-sm text-gray-400 flex items-end">
        {props.dayReference}
      </div>
      <div className="font-bold">{props.day}</div>
      <div className="text-gray-500">{props.date}</div>
    </div>
  );
};
