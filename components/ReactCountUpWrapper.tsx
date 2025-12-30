"use client";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

function ReactCountUpWrapper({ value }: { value: number }) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return "-";
  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
}

export default ReactCountUpWrapper;
