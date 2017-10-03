import * as React from "react";

import AdditionalRequirementData from "shared/types/additional-requirement-data";

import CircledArrowUpIcon from "shared/components/icons/circled-arrow-up-icon";
import CircledArrowDownIcon from "shared/components/icons/circled-arrow-down-icon";
import ScoreField from "shared/components/ui/score-field";
import clone from "shared/util/clone";

import "./hs-additional-requirements.scss";

interface HSAdditionalRequirementsProps {
  requirements: AdditionalRequirementData[]
  onChange: (newReqs: AdditionalRequirementData[]) => any
}

const HSAdditionalRequirements: React.SFC<HSAdditionalRequirementsProps> = (props) => {

  const createValueEditedHandler = (i: number) => {
    return (newValue: string) => {
      const reqs: AdditionalRequirementData[] = clone(props.requirements);
      reqs[i].value = newValue;
      props.onChange(reqs);
    }
  };

  const createIncrementHandler = (i: number) => {
    return () => {
      const reqs: AdditionalRequirementData[] = clone(props.requirements);
      reqs[i].value = reqs[i].incrementValueFunction(reqs[i].value);
      props.onChange(reqs);
    }
  };

  const createDecrementHandler = (i: number) => {
    return () => {
      const reqs: AdditionalRequirementData[] = clone(props.requirements);
      reqs[i].value = reqs[i].decrementValueFunction(reqs[i].value);
      props.onChange(reqs);
    }
  };

  return (
    <div className="hs-additional-requirements-container">
      { props.requirements.map( (requirement, i) => {
        return (
          <div 
            className="hs-additional-requirement"
            key={requirement.name}
          >
            <div className="hs-additional-requirement-label">
              {requirement.name}
            </div>
            <div className="hs-additional-requirement-input">
              <ScoreField 
                label={null}
                value={requirement.value ? requirement.value : " "}
                onChange={createValueEditedHandler(i)}
                editable={true}
                validationFunction={requirement.validationFunction}
                size="sm"
              />
              <div className="requirement-change-button-container">
                <button 
                  className="requirement-change-button" 
                  onClick={createIncrementHandler(i)}>
                    <CircledArrowUpIcon width="24px" height="24px"/>
                </button>
                <button 
                  className="requirement-change-button" 
                  onClick={createDecrementHandler(i)}>
                    <CircledArrowDownIcon width="24px" height="24px"/>
                </button>
              </div>
            </div>
          </div>
        )
      }) }
    </div>
  )

};

export default HSAdditionalRequirements;
