import { type ClassValue, clsx } from "clsx";
import { endOfDay, formatISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGender(gender: "L" | "P") {
  return gender === "L" ? "Laki-laki" : "Perempuan";
}

export function dateToISO(value: Date) {
  return formatISO(endOfDay(new Date(value)));
}

export function formatTanggal(isoDateString: string) {
  const date = new Date(isoDateString);

  const day = date.getDate();
  const month = date.getMonth(); // Note: getMonth() returns 0-based month index
  const year = date.getFullYear();

  const indonesianMonths = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const formattedDate = `${day} ${indonesianMonths[month]} ${year}`;
  return formattedDate;
}
