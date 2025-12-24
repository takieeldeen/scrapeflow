"use client";
import { ParamProps } from "@/types/appNode";

function StringParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}

export default StringParam;
