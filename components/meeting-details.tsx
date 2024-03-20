"use client";

import { TimeContext, TimeContextProps } from "@/providers/time-provider";
import { useContext } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import { ChevronsRightIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export const MeetingDetails = ({ hostName }: { hostName: string }) => {
  const { value } = useContext(TimeContext) as TimeContextProps;
  const { userId } = useParams();
  const { user } = useUser();
  const handleBookMeeting = () => {
    const fetchBooking = async () => {
      try {
        const response = await axios.post("/api/meetings/" + userId, {
          meetingId: value.id,
          guestName: user?.fullName,
        });
        window.location.reload();
      } catch (error) {}
    };
    fetchBooking();
  };

  return (
    <div className="flex flex-1 flex-col  text-gray-600">
      <h1 className="font-semibold text-lg">Meeting Details</h1>
      <p className="text-sm">Host name: {hostName}</p>
      {value.date && value.startTime && (
        <div className="mt-5 flex flex-col flex-1">
          <div className="flex-1 flex flex-col gap-4">
            <p className="font-mono">Date: {value.date}</p>
            <div className="flex gap-5 font-mono">
              <p>From: {value.startTime}</p>
              <ChevronsRightIcon />
              <p>To: {value.endTime}</p>
            </div>
            <p>
              Topic:{" "}
              <span className="italic">
                {value.topic ? value.topic : "General"}
              </span>
            </p>
            {value.guestName && (
              <p className="text-sm">Booked by: {value.guestName}</p>
            )}
          </div>

          {userId && !value.booked && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Book</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure you want to book
                    this meeting?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBookMeeting}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
};
