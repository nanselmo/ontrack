import StudentScore from "shared/types/student-score";
import StudentScores from "shared/types/student-scores";
import ScoreType from "shared/enums/score-type";

import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";

export const getAveragePercentileDifference = (fromScores: StudentScores, fromGradeLevel: number, toScores: StudentScores, toGradeLevel: number): number => {
  let averagePercentileDifference: number;
  let sumPercentileDifference: number = 0;
  const percentileArrayA = toPercentileArray(fromScores, fromGradeLevel);
  const percentileArrayB = toPercentileArray(toScores, toGradeLevel);
  const numPercentiles = percentileArrayA.length;
  for (let i = 0; i < numPercentiles; i++) {
    const percentileA = percentileArrayA[i];
    const percentileB = percentileArrayB[i];
    sumPercentileDifference += percentileA - percentileB;
  }
  return sumPercentileDifference / numPercentiles;
};

export const projectScores = (scores: StudentScores, percentileChange: number, studentGrade: number, targetGrade: number): StudentScores => {
  const projectedScores: StudentScores = {
    nweaMath: adjustScore(scores.nweaMath, ScoreType.nweaMath, percentileChange, studentGrade, targetGrade),
    nweaRead: adjustScore(scores.nweaRead, ScoreType.nweaRead, percentileChange, studentGrade, targetGrade),
    subjGradeMath: adjustScore(scores.subjGradeMath, ScoreType.subjGradeMath, percentileChange, studentGrade, targetGrade),
    subjGradeRead: adjustScore(scores.subjGradeRead, ScoreType.subjGradeRead, percentileChange, studentGrade, targetGrade),
    subjGradeSci: adjustScore(scores.subjGradeSci, ScoreType.subjGradeSci, percentileChange, studentGrade, targetGrade),
    subjGradeSocStudies: adjustScore(scores.subjGradeSocStudies, ScoreType.subjGradeSocStudies, percentileChange, studentGrade, targetGrade),
  };
  return projectedScores;
};

const toPercentileArray = (scores: StudentScores, gradeLevel: number): number[] => {
  let percentileArray = [
    scoreToPercentile(scores.nweaMath, ScoreType.nweaMath, gradeLevel),
    scoreToPercentile(scores.nweaRead, ScoreType.nweaRead, gradeLevel),
    scoreToPercentile(scores.subjGradeMath, ScoreType.subjGradeMath, gradeLevel),
    scoreToPercentile(scores.subjGradeRead, ScoreType.subjGradeRead, gradeLevel),
    scoreToPercentile(scores.subjGradeSci, ScoreType.subjGradeSci, gradeLevel),
    scoreToPercentile(scores.subjGradeSocStudies, ScoreType.subjGradeSocStudies, gradeLevel),
  ];
  return percentileArray;
};

const adjustScore = (score: number, scoreType: ScoreType, percentileChange: number, studentGrade: number, targetGrade: number) => {
  const originalPercentileScore = scoreToPercentile(score, scoreType, studentGrade);
  let projectedPercentileScore = originalPercentileScore + percentileChange;
  if (projectedPercentileScore < 1) {
    projectedPercentileScore = 1;
  } else if (projectedPercentileScore > 99) {
    projectedPercentileScore = 99;
  }
  return percentileToScore(projectedPercentileScore, scoreType, targetGrade);
};
