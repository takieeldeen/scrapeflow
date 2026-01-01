"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function PeriodSelector({
  periods,
  selectedPeriod,
}: {
  periods: Period[];
  selectedPeriod: Period;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log("rerendered");
  return (
    <Select
      defaultValue={`${selectedPeriod.year}-${selectedPeriod.month}`}
      onValueChange={(newVal) => {
        const [year, month] = newVal.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("year", year);
        params.set("month", month);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-45">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods?.map((period) => (
          <SelectItem
            key={`${period.year}-${period.month}`}
            value={`${period.year}-${period.month}`}
          >
            {period.year} {MONTH_NAMES[period.month]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default PeriodSelector;
