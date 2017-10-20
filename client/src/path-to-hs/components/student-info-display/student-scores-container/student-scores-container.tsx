import * as React from "react";

import Partition from "shared/components/layout/partition";

import ScoreDisplay from "./score-display";
import ScoreTransformer from "./score-transformer/score-transformer";

import StudentScores from "shared/types/student-scores";


interface Props {
  scores: StudentScores
  onChange: (newGrades: StudentScores) => any
  shouldDisplayFutureScores: boolean
  editable: boolean
}

type ScoreTransformerFunction = (StudentScores) => StudentScores;

interface State {
  currentScores: StudentScores
  shouldDisplayFutureScores: boolean
  scoreTransformerFunction: ScoreTransformerFunction
  editable: boolean
  onChange: (newGrades: StudentScores) => any
}

class StudentScoresContainer extends React.PureComponent<Props, State> {
  constructor(props){
    super(props);
    this.state = {
      currentScores: props.scores,
      shouldDisplayFutureScores: props.shouldDisplayFutureScores,
      editable: props.editable,
      // FIXME: is this a sensical default?
      scoreTransformerFunction: (scores: StudentScores) => {
        console.log("old one!");
        return scores;
      },
      onChange: props.onChange
    }
  }

  private handleScoreProjectorChange(transformer: ScoreTransformerFunction): void {
    this.setState({
      scoreTransformerFunction: transformer 
    });
  }

  private handleCurrentScoresChange(newScores: StudentScores): void {
    this.setState({
      currentScores: newScores
    });
  }

  render() {
    if (this.state.shouldDisplayFutureScores) {
      return (
        <Partition flex={{justifyContent: "space-around", alignItems: "stretch"}}>
          <ScoreDisplay 
            scores={this.state.currentScores}
            editable={this.state.editable}
            onChange={this.handleCurrentScoresChange.bind(this)} />
          <ScoreTransformer 
            onChange={this.handleScoreProjectorChange.bind(this)}/>
          <ScoreDisplay 
            scores={this.state.scoreTransformerFunction(this.state.currentScores)}
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
            onChange={this.handleCurrentScoresChange.bind(this)} />
        </div>
      )
    }
  }
}

export default StudentScoresContainer;
