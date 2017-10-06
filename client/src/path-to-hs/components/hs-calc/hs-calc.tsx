import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";

import Box from "shared/components/layout/box";
import StudentInfoContainer from "./student-info-container/student-info-container";
import StudentScoresContainer from "./student-scores-container/student-scores-container";

interface HSCalcProps {
  studentData: StudentData
}

interface HSCalcState {
  studentData: StudentData
}

class HSCalculator extends React.Component<HSCalcProps, HSCalcState> {

  constructor(props) {
    super(props);
    this.state = {
      studentData: props.studentData
    }
  }

  private handleInfoChange(info: StudentData): any {

  }

  private handleScoreChange(newScores: StudentScores): any {

  }

  // FIXME: hardcoded shouldDisplayFutureScores and editable
  render() {
    return (
      <Box width="half" height="half" responsiveBehavior={{mobile: "fullscreen"}}>
        <StudentInfoContainer 
          onChange={this.handleInfoChange}
          studentInfo={this.state.studentData}/>
        <StudentScoresContainer 
          shouldDisplayFutureScores={true}
          editable={true}
          onChange={this.handleScoreChange}
          scores={this.state.studentData.scores}/>
      </Box>
    )
  }

};

export default HSCalculator;
