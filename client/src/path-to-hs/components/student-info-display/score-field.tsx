import * as React from "react";

import ScoreType from "shared/enums/score-type";
import StudentScore from "shared/types/student-score";
import {scoreToString, tryParseScore} from "shared/util/grade-convert";
import Field from "shared/components/ui/field";
import IconButton from "shared/components/ui/icon-button";
import CircledArrowUpIcon from "shared/components/icons/circled-arrow-up-icon";
import CircledArrowDownIcon from "shared/components/icons/circled-arrow-down-icon";

import "./score-field.scss";;

interface ScoreFieldProps {
  scoreType: ScoreType
  score: StudentScore 
  editable: boolean
  onChange: (newScore: StudentScore) => any
}

interface ScoreFieldState {
  value: string
  invalidInput: boolean 
}

// FIXME: temp
const getLabel = (scoreType: ScoreType): string => {
  switch(scoreType){
    case ScoreType.nweaMath:
      return "NWEA Math";
    case ScoreType.nweaRead:
      return "NWEA Reading";
    case ScoreType.subjGradeMath:
      return "Math";
    case ScoreType.subjGradeRead:
      return "Reading";
    case ScoreType.subjGradeSci:
      return "Science";
    case ScoreType.subjGradeSocStudies:
      return "Social Studies";
  }
};

class ScoreField extends React.PureComponent<ScoreFieldProps, ScoreFieldState> {

  constructor(props) {
    super(props);
    this.state = {
      value: scoreToString(props.score, props.scoreType),
      invalidInput: false
    };
  }

  private handleTextInput = (event: React.FormEvent<HTMLInputElement>) => {
    const text:string = event.currentTarget.value;
    const [success, score] = tryParseScore(text, this.props.scoreType);
    if (success) {
      this.props.onChange(score);
    } else {
      this.setState({invalidInput: true});
    }
  }

  render() {
    return (
      <div className={`score-field lg ${this.state.invalidInput ? "invalid" : ""}`}>
        <div className={'score-field-label'}>
          {getLabel(this.props.scoreType)}
        </div>
        <input
          className={`score-field-input lg ${this.props.editable ? "enabled" : ""}`}
          defaultValue={this.state.value}
          onChange={this.handleTextInput}
        />
        <div className={"score-adjust-buttons"}>
          <button 
            className="score-adjust-button" 
            onClick={this.props.onChange(this.props.score + 1)}>
              <CircledArrowUpIcon width="24px" height="24px"/>
          </button>
          <button 
            className="score-adjust-button" 
            onClick={this.props.onChange(this.props.score - 1)}>
              <CircledArrowDownIcon width="24px" height="24px"/>
          </button>
        </div>
      </div>
    );
  }
};

export default ScoreField;
