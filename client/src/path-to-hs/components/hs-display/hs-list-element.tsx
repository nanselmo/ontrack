import * as React from "react";

import Highschool from "shared/types/highschool";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

interface HSListElementProps {
  highschool: Highschool
  studentData: StudentData
  additionalRequirements: AdditionalRequirements
}

import "./hs-list-element.scss";

const HSListElement: React.SFC<HSListElementProps> = (props) => {
  
  const hs = props.highschool;

  const canApply: boolean = hs.applicationRequirementsFunction(props.studentData, props.additionalRequirements); 
  const likelySelected: boolean = hs.selectionRequirementsFunction(props.studentData, props.additionalRequirements);

  let className="hs-list-element";
  if (canApply === false) {
    className += " disabled";
  } else if (likelySelected === true) {
    className += " active-outline";
  }  
  if (props.highschool.iconUrl) {
    return (
      <div className={className}>
        {props.highschool.initials}
      </div>
    )
  } else {
    return (
      <div className={className}>
        <span className="hs-list-element-initials">{props.highschool.initials}</span>
      </div>
    )
  }

};

export default HSListElement;
