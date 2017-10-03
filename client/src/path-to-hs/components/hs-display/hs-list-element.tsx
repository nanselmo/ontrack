import * as React from "react";

import Highschool from "shared/types/highschool";
import StudentData from "shared/types/student-data";
import AdditionalRequirementData from "shared/types/additional-requirement-data";

interface HSListElementProps {
  highschool: Highschool
  studentData: StudentData
  addlRequirements: AdditionalRequirementData[]
}

import "./hs-list-element.scss";

const HSListElement: React.SFC<HSListElementProps> = (props) => {
  
  const hs = props.highschool;
  const cannotApply: boolean = hs.applicationRequirementsFunction(
    props.studentData, 
    props.addlRequirements);
  const likelySelected: boolean = hs.selectionRequirementsFunction(
    props.studentData, 
    props.addlRequirements);

  let className="hs-list-element";
  if (cannotApply) {
    className += "disabled";
  } else if (likelySelected) {
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