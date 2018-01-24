import * as React from "react";

import ValidationState from "shared/enums/validation-state";

interface DropdownInputProps {
  label?: string
  value: string
  //placeholder?: string
  options: {value: string, text: string}[]
  onChange: (newVal: string) => void
  validationState?: ValidationState
}

const DropdownInput: React.SFC<DropdownInputProps> = props => {
  return (
    <div 
      className={"dropdown-input " + (props.validationState ? props.validationState.toString() : "") }
    >
      {props.label &&
      <div className="input-label">
        {props.label}
      </div>
      }
      <select
        value={props.value}
        onChange={(ev) => props.onChange(ev.currentTarget.value)}
      >
        { props.options.map( opt => <option key={opt.value} value={opt.value}>{opt.text}</option> ) }
      </select>
    </div>
  )
};

export default DropdownInput;
