import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";

import styled from "styled-components";

const TextField: React.SFC<FieldProps> = (props) => {

  const validation = props.validator ? props.validator(props.value) 
                                     : FieldValidationState.NEUTRAL;

  return (
    <FieldContainer className={props.className} label={props.label} validation={validation}>
      <input type="text" className="field-input-element" onChange={createFieldChangeHandler(props)}>
        {props.children}
      </input>
    </FieldContainer>
  );
};

export default TextField;
