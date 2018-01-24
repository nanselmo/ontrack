import * as React from "react";
import "react-widgets/dist/css/react-widgets.css";
import {Combobox} from "react-widgets";

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
      <Combobox
        data={props.options}
        textField='text'
        valueField='value'

        onChange={props.onChange}
        value={props.value}
       >
      </Combobox>
    </div>
  );
};

export default ComboBoxInput;
