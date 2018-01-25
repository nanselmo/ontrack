import * as React from "react";
import FieldProps from "./field-props";

const createFieldChangeHandler = (props: FieldProps): React.ChangeEventHandler<any> => {
  return (ev): void => {
    const newValue = ev.currentTarget.value;
    const shouldUpdate = props.restrictor ? props.restrictor(newValue)
                                           : true;

    if (shouldUpdate) {
      props.onChange(newValue);
    }
  }
};

export default createFieldChangeHandler;
