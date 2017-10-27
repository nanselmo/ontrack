import * as React from "react";

import Page from "shared/components/layout/page";
import StudentInfoDisplay from "./components/student-info-display/student-info-display";
import HSDisplay from "./components/hs-display/hs-display";

// TODO: remove hardcoded test data
import {MOCK_STUDENT_DATA, MOCK_HS_DATA} from "./hardcoded";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import {clone} from "shared/util/clone";
import {projectScores} from "shared/util/score-projection-utils";

interface PathToHSProps {
}

interface PathToHSState {
  studentData: StudentData
  projectedStudentData: StudentData
}

class PathToHS extends React.Component<PathToHSProps, PathToHSState> {
  
  constructor(props){
    super(props);
    let projectedData = clone(MOCK_STUDENT_DATA);
    projectedData.scores = projectScores(MOCK_STUDENT_DATA.scores, 0, MOCK_STUDENT_DATA.gradeLevel, 7);
    this.state = {
      studentData: MOCK_STUDENT_DATA,
      projectedStudentData: projectedData
    };
  }

  private handleProjectedStudentDataChange = (newProjectedData: StudentData) => {
    this.setState({
      projectedStudentData: newProjectedData
    });
  }

  render() {
    return (
      <Page>
        <StudentInfoDisplay
          studentData={this.state.studentData}
          projectedStudentData={this.state.projectedStudentData}
          onProjectedStudentDataChange={(newData) => this.setState({projectedStudentData: newData})}
          />
          
        <HSDisplay
          hsData={MOCK_HS_DATA}
          studentData={this.state.projectedStudentData} 
          />
      </Page>
    )
  }
};

export default PathToHS;
