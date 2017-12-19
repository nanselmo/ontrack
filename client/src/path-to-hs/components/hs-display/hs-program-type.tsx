import * as React from "react";

import HSProgram from "shared/types/hs-program";
import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

import Partition from "shared/components/layout/partition";
import HSList from "./hs-list";
import AdditionalRequirementsContainer from "./additional-requirements-container";

import "./hs-program-type.scss";

interface HSProgramTypeProps {
  programType: string
  programs: HSProgram[]
  studentData: StudentData
}


class HSProgramType extends React.PureComponent<HSProgramTypeProps> {

  render() {
    return (
      <div className="hs-category-container">
        <div className="hs-category-title">
          {this.props.programType}
        </div>
        <HSList 
          highschools={this.props.programs}
          studentData={this.props.studentData}
          />
      </div>
    )
  }

};

export default HSProgramType;
