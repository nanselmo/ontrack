import * as React from "react";
import FieldValidationState from "./field-validation-state";

interface FieldProps {

  // base
  value: string
  defaultValue: string
  onChange: (newValue: string) => any

  // extensions
  validation?: (nextValue: string) => FieldValidationState
  restriction?: (nextValue: string) => boolean
  label?: string

  // styling
  className?: string
  style: React.StyleHTMLAttributes<HTMLInputElement>

}

export default FieldProps;
