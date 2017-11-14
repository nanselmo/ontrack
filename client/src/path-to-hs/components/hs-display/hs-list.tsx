import * as React from "react";

import Highschool from "shared/types/highschool";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

import HSListElement from "./hs-list-element";

interface HSListProps {
  highschools: Highschool[]
  studentData: StudentData
  addlRequirements: AdditionalRequirements 
}

import "./hs-list.scss";

const HSList: React.SFC<HSListProps> = (props) => {

  return (
    <div className="hs-list">
      { 
        props.highschools.map( (hs: Highschool) => <HSListElement key={hs.longName} 
                              highschool={hs} 
                              studentData={props.studentData} 
                              additionalRequirements={props.addlRequirements} /> )
      }
    </div>
  )

};

export default HSList;
