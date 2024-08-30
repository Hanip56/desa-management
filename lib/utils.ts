import { type ClassValue, clsx } from "clsx";
import {
  differenceInDays,
  endOfDay,
  format,
  formatISO,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { createCanvas, loadImage } from "canvas";

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

export function getAlamat(kampung: string, rt: string, rw: string) {
  return `Kp. ${kampung} RT ${rt} RW ${rw}`;
}

export function getStatusPerkawinan(status: string) {
  const replaced = status.replace("_", " ");
  return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
}

export function getRangeDays(dateFrom: Date | string, dateTo: Date | string) {
  let from = dateFrom;
  let to = dateTo;

  if (typeof from === "string") {
    from = new Date(dateFrom);
  }

  if (typeof to === "string") {
    to = new Date(dateTo);
  }

  const number = differenceInDays(to, from) + 1;

  const text =
    to.getTime() !== from.getTime()
      ? `${format(from, "d MMMM", { locale: id })} sampai ${format(
          to,
          "d MMMM",
          {
            locale: id,
          }
        )}`
      : `${format(from, "d MMMM", { locale: id })}`;

  return { number, text };
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

export function ByteaToFile(buffer: Buffer) {
  // Convert the BYTEA data to a Buffer (Node.js) or Uint8Array (Browser)
  const fileBuffer = Buffer.from(buffer); // In Node.js
  // const fileBuffer = new Uint8Array(byteaData); // In Browser

  // Create a Blob from the buffer (works in both Node.js and browser environments)
  const fileBlob = new Blob([fileBuffer], { type: "image/png" });

  // Create a File object from the Blob
  const file = new File([fileBlob], "qr", { type: "image/png" });

  return file;
}

export const base64ToFile = (
  base64String: string,
  fileName: string,
  fileType: string
): File => {
  // Check if the Base64 string contains a data URL prefix and remove it
  const base64Data = base64String.replace(
    /^data:[a-zA-Z]*\/[a-zA-Z]*;base64,/,
    ""
  );

  // Decode Base64 string to binary data
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([bytes], { type: fileType });

  // Create a File object from the Blob
  const file = new File([blob], fileName, { type: fileType });

  return file;
};

export async function resizeImageBuffer(
  buffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
  // Load the image from the buffer
  const image = await loadImage(buffer);

  // Create a canvas with the desired dimensions
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw the image onto the canvas, resizing it
  ctx.drawImage(image, 0, 0, width, height);

  // Get the resized image as a buffer in PNG format
  return canvas.toBuffer("image/png");
}
