import * as React from "react";

import "./form.scss";

interface FormProps {
  children?: any
}

const Form = (props) => (
  <div className="form">
    {props.children}
  </div>
);

export default Form;
