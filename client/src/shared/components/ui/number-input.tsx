import * as React from "react";

import ValidationState from "shared/enums/validation-state";

interface NumberInputProps {
  value: number
  onChange: (newVal: number) => any
  label?: string
  validationState?: ValidationState;
}

const NumberInput: React.SFC<NumberInputProps> = props => {

  return (
    <div 
      className={"number-input " + (props.validationState ? props.validationState.toString() : "") }
    >
      {props.label &&
      <div className="input-label">
        {props.label}
      </div>
      }
      <input
        type="number"
        value={props.value}
        onChange={(ev) => props.onChange(ev.currentTarget.valueAsNumber) }
      />
    </div>
  )
}

export default NumberInput;
