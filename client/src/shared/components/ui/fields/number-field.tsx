import * as React from "react";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";

interface NumberFieldProps {
  onChange: (newValue: number) => any
  value: number

  // extensions
  validator?: (nextValue: number) => FieldValidationState
  restrictor?: (nextValue: number) => boolean
  label?: string
  placeholder?: string

  // styling
  className?: string
  style?: React.StyleHTMLAttributes<HTMLInputElement>
}


const NumberField: React.SFC<NumberFieldProps> = (props) => {

  const handleChange = (ev): void => {
    const newValue = ev.currentTarget.valueAsNumber;
    const shouldUpdate = props.restrictor ? props.restrictor(newValue)
                                           : true;

    if (shouldUpdate) {
      props.onChange(newValue);
    }
  };

  const validation = props.validator ? props.validator(props.value) 
                                     : FieldValidationState.NEUTRAL;
  return (
    <FieldContainer className={props.className} label={props.label} validation={validation}>
      <input type="number" className="field-input-element" onChange={handleChange}>
        {props.children}
      </input>
    </FieldContainer>
  );
};

export default NumberField;

