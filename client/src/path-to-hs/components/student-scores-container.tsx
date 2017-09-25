import * as React from "react";

import Partition from "shared/components/layout/partition";

import ScoreDisplay from "./score-display";
import ScoreTransformer from "./score-transformer";

import StudentScores from "shared/types/student-scores";


interface Props {
  scores: StudentScores
  onChange: (newGrades: StudentScores) => any
  shouldDisplayFutureScores: boolean
  editable: boolean
}

type ScoreProjectorFunction = (StudentScores) => StudentScores;

interface State {
  currentScores: StudentScores
  shouldDisplayFutureScores: boolean
  scoreProjector: ScoreProjectorFunction
  editable: boolean
}

class StudentScoresContainer extends React.PureComponent<Props, State> {
  constructor(props){
    super(props);
    this.state = {
      currentScores: props.scores,
      shouldDisplayFutureScores: props.shouldDisplayFutureScores,
      editable: props.editable,
      // FIXME: is this a sensical default?
      scoreProjector: (scores: StudentScores) => scores,
    }
  }

  private handleScoreProjectorChange(projector: ScoreProjectorFunction): void {
    this.setState({
      scoreProjector: projector
    });
  }

  private handleCurrentScoresChange(newScores: StudentScores): void {

  }

  render() {
    if (this.state.shouldDisplayFutureScores) {
      return (
        <Partition flex={{justifyContent: "space-around", alignItems: "stretch"}}>
          <ScoreDisplay 
            scores={this.state.currentScores}
            editable={this.state.editable}
            onChange={this.handleCurrentScoresChange.bind(this)} />
          <ScoreTransformer onChange={this.handleScoreProjectorChange.bind(this)}/>
          <ScoreDisplay 
            scores={this.state.scoreProjector(this.state.currentScores)}
            editable={false}
            onChange={() => null}/>
        </Partition>
      )
    } else {
      return (
        <div>
          <ScoreDisplay 
            scores={this.state.currentScores}
            editable={this.state.editable}
            onChange={this.handleCurrentScoresChange} />
        </div>
      )
    }
  }
}

export default StudentScoresContainer;
