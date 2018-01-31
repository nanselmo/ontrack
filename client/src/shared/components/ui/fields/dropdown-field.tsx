import * as React from "react";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";

interface DropdownFieldProps {
  value: string
  onChange: (newValue: string) => any

  label?: string
  placeholder?: string

  validator?: (nextVal: string) => FieldValidationState
  restrictor?: (nextVal: string) => boolean

  className?: string
}

const DropdownField: React.SFC<DropdownFieldProps> = (props) => {

  const validation = props.validator ? props.validator(props.value) 
                                     : FieldValidationState.NEUTRAL;

  const handleChange = (ev): void => {
    const newValue = ev.currentTarget.value;
    const shouldUpdate = props.restrictor ? props.restrictor(newValue)
                                           : true;

    if (shouldUpdate) {
      props.onChange(newValue);
    }
  };

  return (
    <FieldContainer className={props.className} label={props.label} validation={validation}>
      <select className="field-input-element" onChange={handleChange}>
        {props.children}
      </select>
    </FieldContainer>
  );
};

export default DropdownField;

