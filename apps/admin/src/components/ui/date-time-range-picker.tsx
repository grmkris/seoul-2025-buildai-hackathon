"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as React from "react";

interface DateTimeRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  className?: string;
}

export function DateTimeRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateTimeRangePickerProps) {
  const formatDateForInput = (date: Date): string => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return utcDate.toISOString().slice(0, 16);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <div className="grid w-full gap-1.5">
        <Label>Start</Label>
        <Input
          type="datetime-local"
          value={formatDateForInput(startDate)}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            if (!Number.isNaN(newDate.getTime())) {
              onStartDateChange(newDate);
            }
          }}
          className="w-full"
        />
      </div>
      <div className="grid w-full gap-1.5">
        <Label>End</Label>
        <Input
          type="datetime-local"
          value={formatDateForInput(endDate)}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            if (!Number.isNaN(newDate.getTime())) {
              onEndDateChange(newDate);
            }
          }}
          className="w-full"
        />
      </div>
    </div>
  );
}
