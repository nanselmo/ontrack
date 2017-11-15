import * as React from "react";

import AdditionalRequirements from "shared/types/additional-requirements";
import AdditionalRequirement from "shared/types/additional-requirement";
import {cloneAndExtend} from "shared/util/clone";

import AdditionalRequirementDisplay from "./additional-requirement-display";

interface AdditionalReqContainerProps {
  additionalRequirements: AdditionalRequirements,
  onRequirementsChange: (newAddlReqs: AdditionalRequirements) => any 
}

import "./additional-requirements-container.scss";

const AdditionalRequirementsContainer = (props: AdditionalReqContainerProps) => {

  const createInputValueChangeHandler = (addlReqKey: string) => {
    return (newValue: number) => {
      const origReq = props.additionalRequirements[addlReqKey];
      const oldValue = origReq.inputValue;
      if (newValue !== oldValue ) {
        if (origReq.inputValidationFn && origReq.inputValidationFn(newValue)) {
          const newReq = cloneAndExtend(origReq, {inputValue: newValue});
          props.onRequirementsChange(cloneAndExtend(props.additionalRequirements, {[addlReqKey]: newReq}));
        }
      }
    };
  };

  const addlReqKeys = Object.keys(props.additionalRequirements);

  return (
    <div className="hs-additional-requirements-container">
      <div className="hs-additional-requirements-header">
        Additional Requirements
      </div>
      { addlReqKeys.map( key => {
        return (<AdditionalRequirementDisplay 
          key={key} 
          {...props.additionalRequirements[key]} 
          onInputValueChange={createInputValueChangeHandler(key)}/>
        )
      }) }
    </div>
  );
};

export default AdditionalRequirementsContainer;
