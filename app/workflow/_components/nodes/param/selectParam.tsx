"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import { useId } from "react";

type Option = {
  label: string;
  value: string;
};
function SelectParam({
  param,
  value,
  updateNodeParamValue,
  connected,
}: ParamProps) {
  const id = useId();
  console.log(value);
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400">*</p>}
      </Label>
      <Select
        value={value}
        onValueChange={(newValue) => {
          updateNodeParamValue(newValue);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: Option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default SelectParam;
