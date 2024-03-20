"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { useRouter } from "next/navigation";

export const User = ({
  props,
}: {
  props: { userId: string; userName: string };
}) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col justify-center items-center gap-5 shadow-sm rounded-md ring-1 ring-gray-300 p-10 hover:cursor-pointer"
      onClick={() => {
        router.push(`${props.userId}/meetings`);
      }}
    >
      <Avatar className="h-20 w-20 bg-slate-100 flex items-center justify-center">
        <AvatarImage src={""} />
        <AvatarFallback>
          {props.userName.split(" ")[0][0]}
          {props.userName.split(" ")[1][0]}
        </AvatarFallback>
      </Avatar>
      <p>{props.userName}</p>
    </div>
  );
};
