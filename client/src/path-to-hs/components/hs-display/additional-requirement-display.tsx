import * as React from "react";

import AdditionalRequirements from "shared/types/additional-requirements";
import AdditionalRequirement from "shared/types/additional-requirement";
import CircledArrowUpIcon from "shared/components/icons/circled-arrow-up-icon";
import CircledArrowDownIcon from "shared/components/icons/circled-arrow-down-icon";

interface AddlReqsDisplayProps extends AdditionalRequirement {
  onInputValueChange: (newVal: number) => any
}

const AdditionalRequirementDisplay = (props: AddlReqsDisplayProps) => {

  return (
    <div className="hs-additional-requirement">
      <div className="hs-additional-requirement-label">
        {props.displayName}
      </div>
      <div className="hs-additional-requirement-description">
        {props.desc}
        { props.links.map( (link: URL) => {
          <div key={link.hash} className="hs-additional-requirement-link">
            {/* TODO: localize */}
            <a href={link.toString()} target="_none">More info here...</a>
            }
          </div>
        }) }
      </div>

      { props.hasNumericInput && 
        <div className="hs-additional-requirement-input">

          <input type="number" value={props.inputValue}
            onChange={ event => event.currentTarget.valueAsNumber } />

          <div className="requirement-change-button-container">
            <button 
              className="requirement-change-button" 
              onClick={() => props.onInputValueChange(props.inputValue + 1)}>
                {<CircledArrowUpIcon width="24px" height="24px"/>}
            </button>
            <button 
              className="requirement-change-button" 
              onClick={() => props.onInputValueChange(props.inputValue - 1)}>
                {<CircledArrowDownIcon width="24px" height="24px"/>}
            </button>
          </div>
        </div>
      }

    </div>
  );
};

export default AdditionalRequirementDisplay;