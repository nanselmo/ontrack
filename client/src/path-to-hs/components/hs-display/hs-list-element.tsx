import * as React from "react";

import Highschool from "shared/types/highschool";
import StudentData from "shared/types/student-data";

interface HSListElementProps {
  highschool: Highschool
  studentData: StudentData
}

import "./hs-list-element.scss";

const HSListElement: React.SFC<HSListElementProps> = (props) => {
  
  const hs = props.highschool;

  const canApply: boolean = hs.applicationRequirementsFunction(props.studentData); 
  const likelySelected: boolean = hs.selectionRequirementsFunction(props.studentData);

  let className="hs-list-element";
  if (likelySelected === true) {
    className += " active-outline";
  } else if (canApply === false) {
    className += " disabled";
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
