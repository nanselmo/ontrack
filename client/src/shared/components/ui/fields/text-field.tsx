import * as React from "react";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";

interface TextFieldProps {

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
const TextField: React.SFC<TextFieldProps> = (props) => {

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
      <input type="text" className="field-input-element" onChange={handleChange}>
        {props.children}
      </input>
    </FieldContainer>
  );
};

export default TextField;
