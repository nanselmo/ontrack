import * as React from "react";

import Highschool from "shared/types/highschool";
import StudentData from "shared/types/student-data";
import AdditionalRequirementData from "shared/types/additional-requirement-data";

import HSListElement from "./hs-list-element";

interface HSListProps {
  highschools: Highschool[]
  studentData: StudentData
  addlRequirements: AdditionalRequirementData[]
}

import "./hs-list.scss";

const HSList: React.SFC<HSListProps> = (props) => {

  return (
    <div className="hs-list">
      { 
        props.highschools.map( (hs: Highschool) => {
        return <HSListElement 
          key={hs.longName} 
          highschool={hs}
          addlRequirements={props.addlRequirements}
          studentData={props.studentData}
          />
        })
      }
    </div>
  )

};

export default HSList;
