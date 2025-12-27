import { AppNodeMissingInputs } from "@/types/appNode";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: VoidFunction;
};

export const FlowValidationContext = createContext<FlowValidationContextType | null>(
  null
);

export default function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  const clearErrors = useCallback(() => {
    setInvalidInputs([]);
  }, []);

  const value = useMemo(
    () => ({
      invalidInputs,
      setInvalidInputs,
      clearErrors,
    }),
    [clearErrors, invalidInputs]
  );

  return (
    <FlowValidationContext.Provider value={value}>
      {children}
    </FlowValidationContext.Provider>
  );
}
