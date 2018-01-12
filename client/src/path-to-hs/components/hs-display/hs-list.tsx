import * as React from "react";

import CPSProgram from "shared/types/cps-program";
import StudentData from "shared/types/student-data";

import HSListElement from "./hs-list-element";

interface HSListProps {
  highschools: CPSProgram[]
  studentData: StudentData
  hsDisplayBoundingRect: ClientRect
} 


import "./hs-list.scss";

const HSList: React.SFC<HSListProps> = props => {

    return (
      <div 
        ref={ elem => elem && (this.ref = elem) }
        className="hs-list">
        { 
          props.highschools.map( (hs: CPSProgram) => <HSListElement key={hs.Long_Name} 
                                hsDisplayBoundingRect={props.hsDisplayBoundingRect}
                                program={hs} 
                                studentData={props.studentData} 
                                /> )
        }
      </div>
    )

};

export default HSList;
