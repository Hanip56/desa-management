"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { id } from "date-fns/locale";

type Props = {
  date: DateRange;
  setDate: (dateRange: DateRange | undefined) => void;
  className?: string;
};

export function DatePickerWithRange({ className, date, setDate }: Props) {
  //   const [date, setDate] = React.useState<DateRange | undefined>({
  //     from: new Date(2022, 0, 20),
  //     to: addDays(new Date(2022, 0, 20), 20),
  //   })

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: id })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: id })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: id })
              )
            ) : (
              <span>Pilih jangka waktu</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            locale={id}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
