import * as React from "react";

import AdditionalRequirements from "shared/types/additional-requirements";
import AdditionalRequirement from "shared/types/additional-requirement";
import {cloneAndExtend} from "shared/util/clone";

import AdditionalRequirementDisplay from "./additional-requirement-display";

interface AdditionalReqContainerProps {
  additionalRequirements: AdditionalRequirements,
  onRequirementsChange: (newAddlReqs: AdditionalRequirements) => any 
}

const AdditionalRequirementsContainer = (props: AdditionalReqContainerProps) => {

  const createInputValueChangeHandler = (addlReqKey: string) => {
    return (newValue: number) => {
      const origReq = props.additionalRequirements[addlReqKey];
      const newReq = cloneAndExtend(origReq, {inputValue: newValue});
      return cloneAndExtend(props.additionalRequirements, {addlReqKey: newReq});
    };
  };

  const addlReqKeys = Object.keys(props.additionalRequirements);

  return (
    <div className="hs-additional-requirements-container">
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
