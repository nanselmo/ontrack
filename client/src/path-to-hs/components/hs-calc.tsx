import * as React from "react";

import StudentInfo from "shared/types/student-info";
import StudentGrades from "shared/types/student-grades";

import Box from "shared/components/layout/box";
import StudentInfoForm from "./student-info-form";
import StudentGradesContainer from "./student-grades-container";

interface HSCalcProps {
  studentInfo: StudentInfo | null
  studentGrades: StudentGrades | null
}

class HSCalculator extends React.Component<HSCalcProps> {

  constructor(props) {
    super(props);
  }

  private handleInfoChange(newInfo: StudentInfo): void {

  }

  private handleGradeChange(newGrades: StudentGrades): void {

  }

  render() {
    return (
      <Box width="half" height="half" responsiveBehavior={{mobile: "fullscreen"}}>
        <StudentInfoForm 
          onChange={this.handleInfoChange}
          studentInfo={this.props.studentInfo}/>
        <StudentGradesContainer 
          onChange={this.handleGradeChange}
          grades={this.props.studentGrades}/>
      </Box>
    )
  }

};

export default HSCalculator;
