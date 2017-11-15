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
  validationFunction?: (score: StudentScore) => boolean
}

interface ScoreFieldState {
  value: string
  invalidInput: boolean 
}

// FIXME: use l10n strings
const getLabel = (scoreType: ScoreType): string => {
  switch(scoreType){
    case ScoreType.nweaPercentileMath:
      return "NWEA Math Percentile";
    case ScoreType.nweaPercentileRead:
      return "NWEA Reading Percentile";
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

  componentWillReceiveProps(newProps) {
    this.setState({
      value: scoreToString(newProps.score, newProps.scoreType),
    });
  }

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
      if (this.props.validationFunction && this.props.validationFunction(score)) {
        this.props.onChange(score);
      } else {
        this.setState({invalidInput: true});
      }
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
          value={this.state.value}
          onChange={this.handleTextInput}
        />
        <div className={"score-adjust-buttons"}>
          <button 
            className="score-adjust-button" 
            onClick={() => this.props.onChange(this.props.score + 1)}>
              <CircledArrowUpIcon width="24px" height="24px"/>
          </button>
          <button 
            className="score-adjust-button" 
            onClick={() => this.props.onChange(this.props.score - 1)}>
              <CircledArrowDownIcon width="24px" height="24px"/>
          </button>
        </div>
      </div>
    );
  }
};

export default ScoreField;
