export type meetingDataTypes = {
  dayReference?: string;
  day: string;
  hostName: string;
  date: string;
  times: {
    id: string;
    startTime: string;
    endTime: string;
    breakTime: string;
    title: string;
    bookingId: string;
    userId: string;
    guestName?: string;
  }[];
  booked: boolean;
};
