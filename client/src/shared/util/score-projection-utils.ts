import StudentScore from "shared/types/student-score";
import StudentScores from "shared/types/student-scores";
import StudentData from "shared/types/student-data";
import ScoreType from "shared/enums/score-type";

import {scoreToPercentile, percentileToScore} from "shared/util/grade-convert";
import {cloneAndExtend} from "shared/util/clone";

export const projectStudentData = (args: {
  studentData: StudentData
  targetGradeLevel: number
  percentileChange: number
}): StudentData => {

  const projectedScores = projectScores(
    args.studentData.scores,
    args.percentileChange,
    args.studentData.gradeLevel,
    args.targetGradeLevel
  );
  return cloneAndExtend(args.studentData, {scores: projectedScores}, {gradeLevel: args.targetGradeLevel});
};

export const getAveragePercentileDifference = (fromScores: StudentScores, fromGradeLevel: number, toScores: StudentScores, toGradeLevel: number): number => {
  let averagePercentileDifference: number;
  let sumPercentileDifference: number = 0;
  const percentileArrayTo = toPercentileArray(fromScores, fromGradeLevel);
  const percentileArrayFrom = toPercentileArray(toScores, toGradeLevel);
  const numPercentiles = percentileArrayTo.length;
  for (let i = 0; i < numPercentiles; i++) {
    const percentileStart = percentileArrayTo[i];
    const percentileEnd = percentileArrayFrom[i];
    const percentileChange = percentileEnd - percentileStart;
    sumPercentileDifference += percentileChange;
  }
  // average all percentile changes in each score category 
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
