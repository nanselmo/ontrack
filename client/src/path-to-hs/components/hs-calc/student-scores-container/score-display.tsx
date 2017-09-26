import * as React from "react";

import ScoreField from "./score-field";

import StudentScores from "shared/types/student-scores";

import clone from "shared/util/clone";

import "./score-display.scss";

interface ScoreDisplayProps {
  editable: boolean
  scores: StudentScores | null
  onChange: (StudentScores) => any
}

const ScoreDisplay = (props: ScoreDisplayProps) => {

  const nweaToString = (score: number): string => score.toString(10);

  const isNWEAScore = (score: string): boolean => {
    // TODO: implement
    return true;
  };

  const isSubjectGrade = (grade: string): boolean => {
    // TODO: implement
    return true;
  };

  const createScoreChangeHandler = (scoreType: string, props: ScoreDisplayProps)
                                        : ((string) => void)  => {
    return function(score: string): void {
      let scores: StudentScores = clone(props.scores);
      scores[scoreType] = score;
      props.onChange(scores); 
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
          defaultValue={props.scores ? nweaToString(props.scores.nweaMath) : ""}
          editable={props.editable}
          validationFunction={isNWEAScore}
          onChange={createScoreChangeHandler("nweaMath", props)}/>
        <ScoreField
          size="lg"
          label="Reading"
          defaultValue={props.scores ? nweaToString(props.scores.nweaRead) : ""}          editable={props.editable}
          validationFunction={isNWEAScore}
          onChange={createScoreChangeHandler("nweaRead", props)}/>
      </div>

      <div className="score-group subject-grades">
        <div className="score-group-label">
          Your School Grades 
        </div>
        <ScoreField
          size="sm"
          label="Math"
          defaultValue={props.scores ? props.scores.subjGradeMath : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler("subjGradeMath", props)}/>
        <ScoreField
          size="sm"
          label="Reading"
          defaultValue={props.scores ? props.scores.subjGradeRead : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler("subjGradeRead", props)}/>
        <ScoreField
          size="sm"
          label="Science"
          defaultValue={props.scores ? props.scores.subjGradeSci : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler("subjGradeSci", props)}/>
        <ScoreField
          size="sm"
          label="Social Studies"
          defaultValue={props.scores ? props.scores.subjGradeSocStudies : ""}
          editable={props.editable}
          validationFunction={isSubjectGrade}
          onChange={createScoreChangeHandler("subjGradeSocStudies", props)}/>
      </div>
    </div>
  )

};

export default ScoreDisplay
