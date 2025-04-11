"use client";

import { addDays, addHours, endOfDay, format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, XCircleIcon } from "lucide-react";
import type * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { kbdVariants } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebounceCallback, useEventListener } from "usehooks-ts";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate?: (date: DateRange | undefined) => void; // Remove optional
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSelect = (newDate: DateRange | undefined) => {
    setDate?.(newDate);
    if (newDate?.from && newDate?.to) {
      updateURL(newDate);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    for (const preset of presets) {
      if (preset.shortcut === event.key) {
        onSelect({ from: preset.from, to: preset.to });
      }
    }
  };

  useEventListener("keydown", handleKeyDown);

  const clearDateRange = () => {
    setDate?.(undefined);
    updateURL(undefined);
  };

  const updateURL = (dateRange: DateRange | undefined) => {
    const params = searchParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();
    if (dateRange?.from && dateRange?.to) {
      params.set(
        "dateRange",
        `${dateRange.from.toISOString()},${dateRange.to.toISOString()}`,
      );
    } else {
      params.delete("dateRange");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "max-w-full justify-start truncate text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              <>
                <span className="truncate">
                  {date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )}
                </span>
                <XCircleIcon
                  className="my-auto ml-2 size-4 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDateRange();
                  }}
                />
              </>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[200px]">
              <DatePresets onSelect={onSelect} selected={date} />
            </div>
            <Separator className="my-2 md:mx-2 md:my-0 md:h-auto md:w-px" />
            <div className="md:w-[300px]">
              <Calendar
                autoFocus
                showYearSwitcher
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={onSelect}
                numberOfMonths={1}
              />
            </div>
          </div>
          <Separator />
          <CustomDateRange onSelect={onSelect} selected={date} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// TODO: probably move to `constants` file
const presets = [
  {
    label: "Today",
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
    shortcut: "d", // day
  },
  {
    label: "Yesterday",
    from: startOfDay(addDays(new Date(), -1)),
    to: endOfDay(addDays(new Date(), -1)),
    shortcut: "y",
  },
  {
    label: "Last hour",
    from: addHours(new Date(), -1),
    to: new Date(),
    shortcut: "h",
  },
  {
    label: "Last 7 days",
    from: startOfDay(addDays(new Date(), -7)),
    to: endOfDay(new Date()),
    shortcut: "w",
  },
  {
    label: "Last 14 days",
    from: startOfDay(addDays(new Date(), -14)),
    to: endOfDay(new Date()),
    shortcut: "b", // bi-weekly
  },
  {
    label: "Last 30 days",
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date()),
    shortcut: "m",
  },
];

function DatePresets({
  selected,
  onSelect,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="text-muted-foreground mx-3 text-xs uppercase">Date Range</p>
      <div className="grid gap-1">
        {presets.map(({ label, shortcut, from, to }) => {
          const isActive = selected?.from === from && selected?.to === to;
          return (
            <Button
              key={label}
              variant={isActive ? "outline" : "ghost"}
              size="sm"
              onClick={() => onSelect({ from, to })}
              className={cn(
                "flex items-center justify-between gap-6",
                !isActive && "border border-transparent",
              )}
            >
              <span className="mr-auto">{label}</span>
              <span className={cn(kbdVariants(), "uppercase")}>{shortcut}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// REMINDER: We can add min max date range validation https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#setting_maximum_and_minimum_dates_and_times
function CustomDateRange({
  selected,
  onSelect,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
}) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(selected?.from);
  const [dateTo, setDateTo] = useState<Date | undefined>(selected?.to);

  const debouncedOnSelect = useDebounceCallback(onSelect, 1000);

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return utcDate.toISOString().slice(0, 16);
  };

  const handleDateChange = (newDate: Date, isFrom: boolean) => {
    if (isFrom) {
      setDateFrom(newDate);
    } else {
      setDateTo(newDate);
    }
    debouncedOnSelect({
      from: isFrom ? newDate : dateFrom,
      to: isFrom ? dateTo : newDate,
    });
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="text-muted-foreground text-xs uppercase">Custom Range</p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="from">Start</Label>
          <Input
            key={formatDateForInput(selected?.from)}
            type="datetime-local"
            id="from"
            name="from"
            defaultValue={formatDateForInput(selected?.from)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!Number.isNaN(newDate.getTime())) {
                handleDateChange(newDate, true);
              }
            }}
            disabled={!selected?.from}
            className="w-full"
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="to">End</Label>
          <Input
            key={formatDateForInput(selected?.to)}
            type="datetime-local"
            id="to"
            name="to"
            defaultValue={formatDateForInput(selected?.to)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!Number.isNaN(newDate.getTime())) {
                handleDateChange(newDate, false);
              }
            }}
            disabled={!selected?.to}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
