import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import EffortLevel from "shared/enums/effort-level";
import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";
import projectScores from "./score-projector";

import Box from "shared/components/layout/box";
import clone from "shared/util/clone";

import ReportCardContainer from "./report-card-container";
//import ReportCard from "./report-card";
//import DemographicInfo from "./demographic-info";

interface StudentInfoDisplayProps {
  studentData: StudentData
}

interface StudentInfoDisplayState {
  studentData: StudentData
  projectedStudentData: StudentData
}

class StudentInfoDisplay extends React.Component<StudentInfoDisplayProps, StudentInfoDisplayState> {

  constructor(props) {
    super(props);
    this.state = {
      studentData: props.studentData,
      projectedStudentData: this.projectData(props.studentData, 0)
    }
  }

  private projectData(data: StudentData, percentileChange: number): StudentData {
    const newData = clone(data);
    newData.scores = projectScores(newData.scores, percentileChange, 7);
    return data;
  }
  

  private handleProjectedStudentDataChange(newData: StudentData): any {
    this.setState({projectedStudentData: newData});
  }

  render() {
    return (
      <Box width="half" height="full" flex={{flexDirection: "column", justifyContent: "center", alignItems: "center"}} responsiveBehavior={{mobile: "fullscreen"}}>
        <ReportCardContainer
          studentData={this.state.studentData}
          projectedStudentData={this.state.projectedStudentData}
          onProjectedStudentDataChange={this.handleProjectedStudentDataChange.bind(this)}
      />
      </Box>
    )
  }

};

export default StudentInfoDisplay;
