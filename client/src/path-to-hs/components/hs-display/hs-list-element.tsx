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
  
  const likelySelected: boolean = props.highschool.selectionRequirementsFunction(
    props.studentData, 
    props.addlRequirements);

  let className="hs-list-element";
  if (likelySelected) {
    className += " active-outline";
  }
  
  if (props.highschool.iconUrl) {
    return (
      <div className="hs-list-element">
        {props.highschool.initials}
      </div>
    )
  } else {
    return (
      <div className="hs-list-element">
        <span className="hs-list-element-initials">{props.highschool.initials}</span>
      </div>
    )
  }

};

export default HSListElement;
