import * as React from "react";

import ValidationState from "shared/enums/validation-state";

interface TextInputProps {
  value: string
  onChange: (newVal: string) => any
  label?: string
  validationState?: ValidationState;
  placeholder?: string
}

const TextInput: React.SFC<TextInputProps> = props => {

  return (
    <div 
      className={"text-input " + (props.validationState ? props.validationState.toString() : "") }
    >
      {props.label &&
      <div className="input-label">
        {props.label}
      </div>
      }
      <input
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(ev) => props.onChange(ev.currentTarget.value) }
      />
    </div>
  )
}

export default TextInput;
