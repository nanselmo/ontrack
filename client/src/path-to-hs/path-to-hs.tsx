import * as React from "react";

import Page from "shared/components/layout/page";
import StudentInfoDisplay from "./components/student-info-display/student-info-display";
import HSDisplay from "./components/hs-display/hs-display";

// TODO: remove hardcoded test data
import {MOCK_STUDENT_DATA} from "./hardcoded";
import {HSConfigData} from "shared/data/hs-config-data";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import {cloneAndExtend} from "shared/util/clone";
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
    this.state = {
      studentData: MOCK_STUDENT_DATA,
      projectedStudentData: this.getProjectedStudentData(MOCK_STUDENT_DATA)
    };
  }

  private getProjectedStudentData = (currentData: StudentData) => {
    const PERCENTILE_CHANGE = 0;
    const PROJECTED_GRADE_LEVEL = 7;
    const projectedScores = projectScores(currentData.scores, PERCENTILE_CHANGE, currentData.gradeLevel, PROJECTED_GRADE_LEVEL);
    console.log(currentData);
    console.log(projectedScores);
    const projectedData = cloneAndExtend(currentData, {scores: projectedScores}, {gradeLevel: PROJECTED_GRADE_LEVEL});
    return projectedData;
  }

  private handleProjectedStudentDataChange = (newProjectedData: StudentData) => {
    this.setState({
      projectedStudentData: newProjectedData
    });
  }

  private handleStudentDataChange = (newStudentData: StudentData) => {
    this.setState({
      studentData: newStudentData,
      projectedStudentData: this.getProjectedStudentData(newStudentData)
    });
  }

  render() {
    return (
      <Page>
        <StudentInfoDisplay
          studentData={this.state.studentData}
          projectedStudentData={this.state.projectedStudentData}
          onStudentDataChange={this.handleStudentDataChange}
          onProjectedStudentDataChange={this.handleProjectedStudentDataChange}
          />
          
        <HSDisplay
          hsData={HSConfigData}
          studentData={this.state.projectedStudentData} 
          />
      </Page>
    )
  }
};

export default PathToHS;
