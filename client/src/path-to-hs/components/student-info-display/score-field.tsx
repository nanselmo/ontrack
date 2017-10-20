import * as React from "react";

import Field from "shared/components/ui/field";
import ScoreType from "shared/enums/score-type";
import StudentScore from "shared/types/student-score";
import {stringToScore, scoreToString} from "shared/util/grade-convert";

import "./score-field.scss";;

interface ScoreFieldProps {
  scoreType: ScoreType
  score: StudentScore 
  editable: boolean
  onChange: (newScore: StudentScore) => any
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


const ScoreField = (props: ScoreFieldProps) => {

  const handleScoreChange = (event: React.FormEvent<HTMLInputElement>) => {
    const scoreString = event.currentTarget.value;
    props.onChange(stringToScore(scoreString, props.scoreType));
  };

  return (
    <div className={`score-field lg`}>
      <div className={'score-field-label'}>
        {getLabel(props.scoreType)}
      </div>
      <input
        className={`score-field-input lg ${props.editable ? "enabled" : ""}`}
        value={props.score ? props.score : " "}
        onChange={handleScoreChange}
      />
    </div>
  );
};

export default ScoreField;
