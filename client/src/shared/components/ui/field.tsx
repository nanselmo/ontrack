import * as React from "react";

import "./field.scss";

interface FieldProps {
  label: string | null
  size: "match-content" | "sm" | "md" | "lg"
  field: React.ReactElement<HTMLSelectElement> | React.ReactElement<HTMLInputElement>
}

const Field = (props: FieldProps) => {
  const className: string = "field-container field-" + props.size;
  if (props.label) {
    return (
      <label className={className}>
        <span className="label-text">{props.label}</span>
        {props.field}
      </label>
    )
  } else {
    return (
      <div className={className}>
        {props.field}
      </div>
    )
  }
};

export default Field;
