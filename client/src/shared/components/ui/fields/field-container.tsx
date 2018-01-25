import * as React from "react";
import styled from "styled-components";
import {css} from "styled-components";

import FieldLabel from "./field-label";
import FieldValidationState from "./field-validation-state";

interface FieldContainerProps {
  className: string
  children?: any
  label: string
  validation: FieldValidationState;
}

const FieldContainerRaw = (props: FieldContainerProps) => (
  <div className={props.className}>
    {
    props.label &&
    <FieldLabel>
      {props.label}
    </FieldLabel>
    }
    {props.children}
  </div>
);
      
const FieldContainer = styled(FieldContainerRaw)`

  padding: 0.5em;
  border: 1px solid gray;

  ${ props => {
    switch(props.validation) {
      case FieldValidationState.SUCCESS:
        return `
          > .field-input-element {
              border: 2px solid green;
              box-shadow: 4px 4px 4px green;
          }
        `;
      case FieldValidationState.FAILURE:
        return `
          > .field-input-element {
            border: 2px solid red;
            box-shadow: 4px 4px 4px red;
          }
        `;
      case FieldValidationState.WARNING:
        return `
          > .field-input-element {
            border: 2px solid yellow;
            box-shadow: 4px 4px 4px yellow;
          }
        `;
      default:`
          > .field-input-element {
            border: 2px solid gray;
            box-shadow: none;
          }
        `;
    }
  }}
`;

export default FieldContainer;
