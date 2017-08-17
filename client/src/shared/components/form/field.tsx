import * as React from "react";

import "./field.scss";

interface FieldProps {
  label?: string | null
  value: string | null
}

const Field = (props: FieldProps) => {

  return (
    <div className="mui-textfield">
      {props.label && 
      <label>
          {props.label}
      </label>
      }
      <input readOnly={true} className="field-value" value={props.value ? props.value : ""} />
    </div>
  )
};

export default Field;
