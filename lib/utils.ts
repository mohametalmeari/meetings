import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getDay = (day: { date: string }) => new Date(day.date).getDate();

export const getMonth = (day: { date: string }) =>
  Months[new Date(day.date).getMonth()];

export const getYear = (day: { date: string }) =>
  new Date(day.date).getFullYear();

export const getDayReference = (day: { date: string }) => {
  const today = new Date();
  const date = new Date(day.date);
  if (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return "Today";
  } else if (
    (today.getDate() + 1 === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()) ||
    (today.getDate() === date.getDate() &&
      today.getMonth() + 1 === date.getMonth() &&
      today.getFullYear() === date.getFullYear()) ||
    (today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() + 1 === date.getFullYear())
  ) {
    return "Tomorrow";
  }
  return "";
};

export const convertTimeFormat = (time: string) => {
  let [hours, minutes] = time.split(":");

  const meridiem = Number(hours) >= 12 ? "PM" : "AM";
  hours = (Number(hours) % 12).toString();
  hours = hours === "0" ? "12" : hours;

  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  return `${hours}:${minutes} ${meridiem}` as string;
};
