import * as React from "react";

import "./field.scss";

interface FieldProps {
  label: string | null
  field: React.ReactElement<HTMLSelectElement> | React.ReactElement<HTMLInputElement>
}

const Field = (props: FieldProps) => {
  if (props.label) {
    return (
      <label className="field-container">
        <span className="label-text">{props.label}</span>
        {props.field}
      </label>
    )
  } else {
    return (
      <div className="field-container">
        {props.field}
      </div>
    )

  }
};

export default Field;
