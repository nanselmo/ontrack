import * as React from "react";
//import styled from "styled-components";
//import {css} from "styled-components";

import "./main.scss";

import FieldLabel from "./field-label";
import FieldValidationState from "./field-validation-state";

interface FieldContainerProps {
  className: string
  children?: any
  label: string
  validation: FieldValidationState;
}

const FieldContainer = (props: FieldContainerProps) => (
  <div className={"field-container" + " " + props.className}>
    {
    props.label &&
    <FieldLabel>
      {props.label}
    </FieldLabel>
    }
    {props.children}
  </div>
);

export default FieldContainer;
