import * as React from "react";

import ScoreField from "./score-field";

import StudentScores from "shared/types/student-scores";
import StudentScore from "shared/types/student-score";
import ScoreType from "shared/enums/score-type";
import EffortLevel from "shared/enums/effort-level";
import {cloneAndExtend} from "shared/util/clone";

import "./report-card.scss";

interface ReportCardProps {
  gradeLevel: number
  scores: StudentScores
  studentName: string
  onScoresChange: (StudentScores) => any
}

const ReportCard = (props: ReportCardProps) => {

  type ScoreChangeHandler = (number) => void

  const createScoreChangeHandler = (scoreType: ScoreType): ScoreChangeHandler => {
    const scoreChangeHandler = (newScore: number): void => {
      if(props.scores[scoreType] !== newScore) {
        const newScores = cloneAndExtend(props.scores, {[scoreType]: newScore});
        props.onScoresChange(newScores); 
      }
    };
    return scoreChangeHandler

  };

  // TODO: add l10n strings
  return (
    <div className="report-card">
      <div className="report-card-header">
        7th Grade Report Card
        <div className="report-card-student-field">
          <span className="report-card-student-label">Student:</span> <span className="report-card-student-name">{props.studentName}</span>
        </div>
      </div>
      <div className="score-group nwea">
        <div className="score-group-label">
          Your NWEA Scores 
        </div>
        <ScoreField
          scoreType={ScoreType.nweaPercentileMath}
          score={props.scores.nweaPercentileMath}
          editable={false}
          onChange={createScoreChangeHandler(ScoreType.nweaPercentileMath)}/>
        <ScoreField
          scoreType={ScoreType.nweaPercentileRead}
          score={props.scores.nweaPercentileRead}
          editable={false}
          onChange={createScoreChangeHandler(ScoreType.nweaPercentileRead)}/>

        <div className="score-group-label">
          Your School Grades 
        </div>
        <ScoreField
          scoreType={ScoreType.subjGradeMath}
          score={props.scores.subjGradeMath}
          editable={false}
          onChange={createScoreChangeHandler(ScoreType.subjGradeMath)}/>
        <ScoreField
          scoreType={ScoreType.subjGradeRead}
          score={props.scores.subjGradeRead}
          editable={false}
          onChange={createScoreChangeHandler(ScoreType.subjGradeRead)}/>
        <ScoreField
          scoreType={ScoreType.subjGradeSci}
          score={props.scores.subjGradeSci}
          editable={false}
          onChange={createScoreChangeHandler(ScoreType.subjGradeSci)}/>
        <ScoreField
          scoreType={ScoreType.subjGradeSocStudies}
          score={props.scores.subjGradeSocStudies}
          editable={false}
          onChange={createScoreChangeHandler(ScoreType.subjGradeSocStudies)}/>
      </div>
    </div>
  )
};

export default ReportCard;
