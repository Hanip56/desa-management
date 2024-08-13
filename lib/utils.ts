import { type ClassValue, clsx } from "clsx";
import { endOfDay, format, formatISO, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  let value = date;

  if (typeof value === "string") {
    value = new Date(date);
  }

  return format(date, "d MMMM yyyy", { locale: id });
}

export function getGender(gender: "L" | "P") {
  return gender === "L" ? "Laki-laki" : "Perempuan";
}

export function dateTimeToISO(value: Date) {
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString();
}

export function dateToISO(value: Date) {
  return formatISO(endOfDay(new Date(value)));
}

export function ISOtoDayAndDate(value: string) {
  const date = parseISO(value);

  return format(date, "EEEE, d MMMM yyyy", { locale: id });
}

export function ISOtoTime(value: string) {
  const date = parseISO(value);

  return format(date, "HH:mm:ss");
}

export function DateToDayAndDate(date: Date) {
  return format(date, "EEEE, d MMMM yyyy", { locale: id });
}

export function DatetoTime(date: Date) {
  return format(date, "HH:mm");
}

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
