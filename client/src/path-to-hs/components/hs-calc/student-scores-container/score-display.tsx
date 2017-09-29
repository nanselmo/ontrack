import * as React from "react";

import ScoreField from "./score-field";

import StudentScores from "shared/types/student-scores";
import ScoreType from "shared/types/score-type";

import clone from "shared/util/clone";
import {toLetterGrade, toNumberGrade} from "shared/util/grade-conversion";

import "./score-display.scss";

interface ScoreDisplayProps {
  editable: boolean
  scores: StudentScores | null
  onChange: (StudentScores) => any
}

const ScoreDisplay = (props: ScoreDisplayProps) => {

  const isNWEAScore = (score: string): boolean => {
    // TODO: implement
    return true;
  };

  const isSubjectGrade = (grade: string): boolean => {
    // TODO: implement
    return true;
  };

  const createScoreChangeHandler = (scoreType: ScoreType, props: ScoreDisplayProps)
                                        : ((string) => void)  => {
    switch(scoreType) {
      case ScoreType.nweaMath:
      case ScoreType.nweaRead:
        return function(scoreAsString: string): void {
          let scores: StudentScores = clone(props.scores);
          scores[scoreType] = Number.parseInt(scoreAsString, 10);
          props.onChange(scores); 
        }
      case ScoreType.subjGradeMath:
      case ScoreType.subjGradeRead:
      case ScoreType.subjGradeSci:
      case ScoreType.subjGradeSocStudies:
        return function(scoreAsString: string): void {
          let scores: StudentScores = clone(props.scores);
          scores[scoreType] = toNumberGrade(scoreAsString);
          props.onChange(scores); 
        }
    }
  };
  
  const stringify = (score: number, scoreType: ScoreType): string => {
    switch(scoreType) {
      case ScoreType.nweaMath:
      case ScoreType.nweaRead:
        return score.toString(10);
      case ScoreType.subjGradeMath:
      case ScoreType.subjGradeRead:
      case ScoreType.subjGradeSci:
      case ScoreType.subjGradeSocStudies:
        return toLetterGrade(score);
    }
  };

  // TODO: add l10n strings
  return (
    <div className="score-display">
      <div className="score-group nwea">
        <div className="score-group-label">
          Your NWEA Scores 
        </div>
        <ScoreField
          size="lg"
          label="Math"
          value={props.scores ? 
            stringify(props.scores.nweaMath, ScoreType.nweaMath) 
            : ""}
          editable={props.editable}
          validationFunction={isNWEAScore}
          onChange={createScoreChangeHandler(ScoreType.nweaMath, props)}/>
        <ScoreField
          size="lg"
          label="Reading"
          value={props.scores ? 
            stringify(props.scores.nweaRead, ScoreType.nweaRead) 
            : ""}
          editable={props.editable}   
          validationFunction={isNWEAScore}
          onChange={createScoreChangeHandler(ScoreType.nweaRead, props)}/>
        <div className="score-group-label">
          Your School Grades 
        </div>
        <ScoreField
          size="sm"
          label="Math"
          value={props.scores ? 
            stringify(props.scores.subjGradeMath, ScoreType.subjGradeMath) 
            : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler(ScoreType.subjGradeMath, props)}/>
        <ScoreField
          size="sm"
          label="Reading"
          value={props.scores ? 
            stringify(props.scores.subjGradeRead, ScoreType.subjGradeRead) 
            : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler(ScoreType.subjGradeRead, props)}/>
        <ScoreField
          size="sm"
          label="Science"
          value={props.scores ? 
            stringify(props.scores.subjGradeSci, ScoreType.subjGradeSci) 
            : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler(ScoreType.subjGradeSci, props)}/>
        <ScoreField
          size="sm"
          label="Social Studies"
          value={props.scores ? 
            stringify(props.scores.subjGradeSocStudies, ScoreType.subjGradeSocStudies)
            : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler(ScoreType.subjGradeSocStudies, props)}/>
      </div>
    </div>
  )

};

export default ScoreDisplay;
