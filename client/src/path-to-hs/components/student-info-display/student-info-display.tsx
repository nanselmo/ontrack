import * as React from "react";

import StudentData from "shared/types/student-data";
import StudentScores from "shared/types/student-scores";
import EffortLevel from "shared/enums/effort-level";
import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";
import ScoreProjector from "./score-projector";

import Box from "shared/components/layout/box";

import ReportCard from "./report-card";
//import DemographicInfo from "./demographic-info";

interface StudentInfoDisplayProps {
  studentData: StudentData
}

interface StudentInfoDisplayState {
  studentData: StudentData
  projectedScores: StudentScores
}

class StudentInfoDisplay extends React.Component<StudentInfoDisplayProps, StudentInfoDisplayState> {

  constructor(props) {
    super(props);
    this.state = {
      studentData: props.studentData,
      projectedScores: this.getProjectedScores(props.studentData.scores, 0)
    }
  }

  private getProjectedScores(scores: StudentScores, percentileChange: number): StudentScores {
    // FIXME: mock
    return scores;
  }

  
  private toEffortLevel = (percentileChange: number): EffortLevel => {
    if (percentileChange < -40) {
      return EffortLevel.NONE;
    } else if (percentileChange < -20) {
      return EffortLevel.LOW;
    } else if (percentileChange < 20) {
      return EffortLevel.NORMAL;
    } else if (percentileChange < 40) {
      return EffortLevel.HIGH;
    } else {
      return EffortLevel.EXTREME;
    }
  }

  private toPercentileChange = (effortLevel: EffortLevel): number => {
    switch(effortLevel) {
      case EffortLevel.NONE:
        return -30;
      case EffortLevel.LOW:
        return -15;
      case EffortLevel.NORMAL:
        return 0;
      case EffortLevel.HIGH:
        return 15
      case EffortLevel.EXTREME:
        return 30
    }
  }

  private handleInfoChange(info: StudentData): any {

  }

  private handleScoreChange(newScores: StudentScores): any {

  }

  private handleEffortLevelChange(newEffortLevel: EffortLevel): any {

  }

  render() {
    return (
      <Box width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
        {/*
        <ReportCard 
          gradeLevel={this.state.studentData.gradeLevel}
          editable={this.state.studentData ? true : false}
          effortLevel={EffortLevel.NORMAL}
          onEffortLevelChange={this.handleEffortLevelChange.bind(this)}
          scores={this.state.studentData.scores}
          onScoresChange={this.handleScoreChange.bind(this)}
        />
        */}
        <ReportCard 
          gradeLevel={7}
          editable={true}
          effortLevel={EffortLevel.NORMAL}
          onEffortLevelChange={this.handleEffortLevelChange.bind(this)}
          scores={this.state.projectedScores}
          onScoresChange={this.handleScoreChange.bind(this)}
        />
        {/*
        <DemographicInfo
          editable={true}
          onChange={this.handleInfoChange}
          data={this.state.studentData}/>
        */}
      </Box>
    )
  }

};

export default StudentInfoDisplay;
