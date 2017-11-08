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
import {projectStudentData} from "shared/util/score-projection-utils";

interface PathToHSProps {
}

interface PathToHSState {
  studentData: StudentData
  projectedStudentData: StudentData
}

class PathToHS extends React.Component<PathToHSProps, PathToHSState> {
  
  constructor(props){
    super(props);
    const HS_APPLICATION_GRADE_LEVEL = 7;
    this.state = {
      studentData: MOCK_STUDENT_DATA,
      projectedStudentData: this.defaultProjectStudentData(MOCK_STUDENT_DATA)
    };
  }

  private defaultProjectStudentData = (data: StudentData) => projectStudentData({
    studentData: data,
    percentileChange: 0,
    targetGradeLevel: 7 
  })

  private handleProjectedStudentDataChange = (newProjectedData: StudentData) => {
    this.setState({
      projectedStudentData: newProjectedData
    });
  }

  private handleStudentDataChange = (newStudentData: StudentData) => {
    this.setState({
      studentData: newStudentData,
      projectedStudentData: this.defaultProjectStudentData(newStudentData)
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
