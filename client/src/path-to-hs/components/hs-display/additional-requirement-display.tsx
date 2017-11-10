import * as React from "react";

import CircledArrowUpIcon from "shared/components/icons/circled-arrow-up-icon";
import CircledArrowDownIcon from "shared/components/icons/circled-arrow-down-icon";

interface AdditionalReqDisplayProps {
  name: string,
  description: string,
  link?: URL,
  shouldDisplayNumericInput: boolean,
  numericInputValue?: number,
  numericInputOnChange?: (newValue: number) => any,
  //shouldDisplayCheckbox: boolean,
  //checkboxValue?: boolean,
  //checkboxOnChange?: (newValue: boolean) => any,
}

const AdditionalRequirementDisplay = (props: AdditionalReqDisplayProps) => {

  return (
    <div className="hs-additional-requirement">
      <div className="hs-additional-requirement-label">
        {props.name}
      </div>
      <div className="hs-additional-requirement-description">
        {props.description}
        { props.link && 
          <div className="hs-additional-requirement-link">
            <a href={props.link.toString()} target="_none">More info</a>
          </div>
        }
      </div>

      { props.shouldDisplayNumericInput && 
        <div className="hs-additional-requirement-input">

          <input type="number" value={props.numericInputValue}
            onChange={ event => event.currentTarget.valueAsNumber } />

          <div className="requirement-change-button-container">
            <button 
              className="requirement-change-button" 
              onClick={props.numericInputOnChange(props.numericInputValue + 1)}>
                {<CircledArrowUpIcon width="24px" height="24px"/>}
            </button>
            <button 
              className="requirement-change-button" 
              onClick={props.numericInputOnChange(props.numericInputValue - 1)}>
                {<CircledArrowDownIcon width="24px" height="24px"/>}
            </button>
          </div>
        </div>
      }

    </div>
  )

};

export default AdditionalRequirementDisplay;