import * as React from "react";

interface ComboBoxProps {
  label?: string
  onChange: (newValue: string) =>  any
  value: string
  options: {value: string, text: string}[]
}

const ComboBoxInput: React.SFC<ComboBoxProps> = (props) => {

  return (
    <div className="dropdown-input">
      {
      props.label &&
      <div className="input-label">
        {props.label}
      </div>
      }
      <select
        onChange={ ev => props.onChange(ev.currentTarget.value) }
       >
       { props.options.map( opt => <option key={opt.value} value={opt.value}>{opt.text}</option> ) }
      </select>
    </div>
  );
};

export default ComboBoxInput;
