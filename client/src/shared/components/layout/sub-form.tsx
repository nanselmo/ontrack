import * as React from "react";

import "./sub-form.scss";

interface SubFormProps {
  label: string
  children?: any
}

const SubForm: React.SFC<SubFormProps> = (props) => (
  <div className="form-subform">
    <div className="form-subheader"> 
      {props.label}
    </div>
    {props.children}
  </div>
);

export default SubForm;
