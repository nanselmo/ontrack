import * as React from "react";

import ScoreField from "./score-field";

import StudentScores from "shared/types/student-scores";
import ScoreType from "shared/enums/score-type";
import EffortLevel from "shared/enums/effort-level";
import clone from "shared/util/clone";

import "./report-card.scss";

interface ReportCardProps {
  gradeLevel: number
  editable: boolean
  scores: StudentScores | null
  onScoresChange: (StudentScores) => any
  effortLevel: EffortLevel
  onEffortLevelChange: (EffortLeve) => any
}

const ReportCard = (props: ReportCardProps) => {

  type ScoreChangeHandler = (number) => void

  const createScoreChangeHandler = (scoreType: ScoreType): ScoreChangeHandler => {
    return (newScore: number): void => {
          let newScores: StudentScores = clone(props.scores);
          newScores[scoreType] = newScore;
          props.onScoresChange(newScores); 
    }
  };

  // TODO: add l10n strings
  return (
    <div className="report-card">
      <div className="score-group nwea">

        <div className="score-group-label">
          Your NWEA Scores 
        </div>
        <ScoreField
          scoreType={ScoreType.nweaMath}
          score={props.scores.nweaMath}
          editable={props.editable}
          onChange={createScoreChangeHandler(ScoreType.nweaMath)}/>
        <ScoreField
          scoreType={ScoreType.nweaRead}
          score={props.scores.nweaRead}
          editable={props.editable}
          onChange={createScoreChangeHandler(ScoreType.nweaRead)}/>

        <div className="score-group-label">
          Your School Grades 
        </div>
        <ScoreField
          scoreType={ScoreType.subjGradeMath}
          score={props.scores.subjGradeMath}
          editable={props.editable}
          onChange={createScoreChangeHandler(ScoreType.subjGradeMath)}/>
        <ScoreField
          scoreType={ScoreType.subjGradeRead}
          score={props.scores.subjGradeRead}
          editable={props.editable}
          onChange={createScoreChangeHandler(ScoreType.subjGradeRead)}/>
        <ScoreField
          scoreType={ScoreType.subjGradeSci}
          score={props.scores.subjGradeSci}
          editable={props.editable}
          onChange={createScoreChangeHandler(ScoreType.subjGradeSci)}/>
        <ScoreField
          scoreType={ScoreType.subjGradeSocStudies}
          score={props.scores.subjGradeSocStudies}
          editable={props.editable}
          onChange={createScoreChangeHandler(ScoreType.subjGradeSocStudies)}/>
      </div>
    </div>
  )
};

export default ReportCard;
