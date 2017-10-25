import ScoreProjectionFunction from "shared/types/score-projection-function";
import StudentScores from "shared/types/student-scores";
import ScoreType from "shared/enums/score-type";

import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";

const projectScores: ScoreProjectionFunction = (scores: StudentScores, percentileChange: number, studentGrade: number): StudentScores => {
  const projectedScores: StudentScores = {
    nweaMath: adjustScore(scores.nweaMath, ScoreType.nweaMath, percentileChange, studentGrade),
    nweaRead: adjustScore(scores.nweaRead, ScoreType.nweaRead, percentileChange, studentGrade),
    subjGradeMath: adjustScore(scores.subjGradeMath, ScoreType.subjGradeMath, percentileChange, studentGrade),
    subjGradeRead: adjustScore(scores.subjGradeRead, ScoreType.subjGradeRead, percentileChange, studentGrade),
    subjGradeSci: adjustScore(scores.subjGradeSci, ScoreType.subjGradeSci, percentileChange, studentGrade),
    subjGradeSocStudies: adjustScore(scores.subjGradeSocStudies, ScoreType.subjGradeSocStudies, percentileChange, studentGrade),
  };
  return projectedScores;
};

const adjustScore = (score: number, scoreType: ScoreType, percentileChange: number, studentGrade: number) => {
  const originalPercentileScore = scoreToPercentile(score, scoreType, studentGrade);
  let projectedPercentileScore = originalPercentileScore + percentileChange;
  if (projectedPercentileScore < 1) {
    projectedPercentileScore = 1;
  } else if (projectedPercentileScore > 99) {
    projectedPercentileScore = 99;
  }
  return percentileToScore(projectedPercentileScore, scoreType, studentGrade);
};


export default projectScores;
