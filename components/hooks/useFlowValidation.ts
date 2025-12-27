import { useContext } from "react";
import { FlowValidationContext } from "../contexts/FlowValidationContext";

export default function useFlowValidation() {
  const flowValidationContext = useContext(FlowValidationContext);
  if (!flowValidationContext)
    throw new Error(
      "useFlowValidation must be used within FlowValidationProvider"
    );
  return flowValidationContext;
}
