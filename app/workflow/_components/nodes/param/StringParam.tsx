"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import { useId } from "react";

function StringParam({
  param,
  value,
  updateNodeParamValue,
  connected,
}: ParamProps) {
  const id = useId();
  let Component: typeof Input | typeof Textarea = Input;
  if (param.variant === "textarea") Component = Textarea;
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400">*</p>}
      </Label>
      <Component
        id={id}
        value={value ?? ""}
        onChange={(e) => {
          updateNodeParamValue(e.target.value);
        }}
        className="text-xs"
        disabled={connected}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
