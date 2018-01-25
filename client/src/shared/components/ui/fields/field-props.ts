import * as React from "react";
import FieldValidationState from "./field-validation-state";

interface FieldProps {

  // base
  // defaultValue: string
  onChange: (newValue: string) => any
  value: string 

  // extensions
  validator?: (nextValue: string) => FieldValidationState
  restrictor?: (nextValue: string) => boolean
  label?: string
  placeholder?: string

  // styling
  className?: string
  style?: React.StyleHTMLAttributes<HTMLInputElement>

}

export default FieldProps;
