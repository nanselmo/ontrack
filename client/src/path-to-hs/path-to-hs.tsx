import * as React from "react";

import Page from "shared/components/layout/page";
import StudentInfoDisplay from "./components/student-info-display/student-info-display";
import HSDisplay from "./components/hs-display/hs-display";

// TODO: remove hardcoded test data
import {MOCK_STUDENT_DATA} from "./hardcoded";
import {getHSProgramsByType} from "shared/util/data-access.ts";
const hsPrograms = getHSProgramsByType();

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import {cloneAndExtend} from "shared/util/clone";
import {projectStudentData} from "shared/util/score-projection-utils";
import calculateGPA from "shared/util/calculate-gpa";

interface PathToHSProps {
}

interface PathToHSState {
  studentData: StudentData
}

class PathToHS extends React.Component<PathToHSProps, PathToHSState> {
  
  constructor(props){
    super(props);
    const HS_APPLICATION_GRADE_LEVEL = 7;
    this.state = {
      studentData: MOCK_STUDENT_DATA,
    };
  }


  private handleStudentDataChange = (newStudentData: StudentData) => {
    newStudentData.gpa = calculateGPA(newStudentData.scores);
    this.setState({
      studentData: newStudentData,
    });
  }

  render() {
    return (
      <Page>
        <StudentInfoDisplay
          studentData={this.state.studentData}
          onStudentDataChange={this.handleStudentDataChange}
          />
          
        <HSDisplay
          hsData={hsPrograms}
          studentData={this.state.studentData} 
          />
      </Page>
    )
  }
};

export default PathToHS;
