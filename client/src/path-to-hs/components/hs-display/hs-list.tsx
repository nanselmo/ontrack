import * as React from "react";

import HSProgram from "shared/types/hs-program";
import StudentData from "shared/types/student-data";

import HSListElement from "./hs-list-element";

interface HSListProps {
  highschools: HSProgram[]
  studentData: StudentData
}

import "./hs-list.scss";

const HSList: React.SFC<HSListProps> = (props) => {

  return (
    <div className="hs-list">
      { 
        props.highschools.map( (hs: HSProgram) => <HSListElement key={hs.Long_Name} 
                              program={hs} 
                              studentData={props.studentData} 
                              /> )
      }
    </div>
  )

};

export default HSList;
