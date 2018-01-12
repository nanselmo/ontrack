import * as React from "react";

import CPSProgram from "shared/types/cps-program";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

import Partition from "shared/components/layout/partition";
import HSList from "./hs-list";
import AdditionalRequirementsContainer from "./additional-requirements-container";

import "./hs-program-type.scss";

interface HSProgramTypeProps {
  programType: string
  programs: CPSProgram[]
  studentData: StudentData
  hsDisplayBoundingRect: ClientRect
}


const HSProgramType: React.SFC<HSProgramTypeProps> = props => {

  return (
    <div className="hs-category-container">
      <div className="hs-category-title">
        {props.programType}
      </div>
      <HSList 
        hsDisplayBoundingRect={props.hsDisplayBoundingRect}
        highschools={props.programs}
        studentData={props.studentData}
        />
    </div>
  )

};

export default HSProgramType;
