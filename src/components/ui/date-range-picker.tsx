"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  placeholder?: string;
}

/** Seletor de intervalo de datas com calendário (estilo shadcn). */
export function DateRangePicker({
  value,
  onChange,
  placeholder = "Selecionar intervalo",
}: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value?.from ? (
          value.to ? (
            <>
              {format(value.from, "dd/MM/yyyy", { locale: pt })} –{" "}
              {format(value.to, "dd/MM/yyyy", { locale: pt })}
            </>
          ) : (
            format(value.from, "dd/MM/yyyy", { locale: pt })
          )
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          locale={pt}
        />
      </PopoverContent>
    </Popover>
  );
}
