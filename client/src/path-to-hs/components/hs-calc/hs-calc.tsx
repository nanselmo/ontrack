import * as React from "react";

import StudentInfo from "shared/types/student-info";
import StudentScores from "shared/types/student-scores";

import Box from "shared/components/layout/box";
import StudentInfoContainer from "./student-info-container/student-info-container";
import StudentScoresContainer from "./student-scores-container/student-scores-container";

interface HSCalcProps {
  studentInfo: StudentInfo
  studentScores: StudentScores
}

interface HSCalcState {
  studentInfo: StudentInfo
  studentScores: StudentScores
}

class HSCalculator extends React.Component<HSCalcProps, HSCalcState> {

  constructor(props) {
    super(props);
    this.state = {
      studentInfo: props.studentInfo,
      studentScores: props.studentScores
    }
  }

  private handleInfoChange(info: StudentInfo): any {

  }

  private handleScoreChange(newScores: StudentScores): any {

  }


  // FIXME: hardcoded shouldDisplayFutureScores and editable
  render() {
    return (
      <Box width="half" height="half" responsiveBehavior={{mobile: "fullscreen"}}>
        <StudentInfoContainer 
          onChange={this.handleInfoChange}
          studentInfo={this.state.studentInfo}/>
        <StudentScoresContainer 
          shouldDisplayFutureScores={true}
          editable={true}
          onChange={this.handleScoreChange}
          scores={this.state.studentScores}/>
      </Box>
    )
  }

};

export default HSCalculator;
