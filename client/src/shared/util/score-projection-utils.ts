import StudentScore from "shared/types/student-score";
import StudentScores from "shared/types/student-scores";
import StudentData from "shared/types/student-data";
import ScoreType from "shared/enums/score-type";

import {cloneAndExtend} from "shared/util/clone";

export const getAveragePercentileDifference = (args: {fromScores: StudentScores, toScores: StudentScores}): number => {
  // get difference for each scoreType
  let differences = [];
  for (let scoreType in ScoreType) {
    const difference = args.toScores[scoreType] - args.fromScores[scoreType];
    if (Number.isNaN(difference)) {
      throw new Error(`Bad calculation: fromScores.${scoreType} = ${args.fromScores[scoreType]}, toScores.${scoreType} = ${args.toScores[scoreType]}`);   
    }
    differences.push(difference);
  }
  return average(differences);
};

export const projectStudentData = (args: {studentData: StudentData, targetGradeLevel: number, percentileChange: number}): StudentData => {
  const projectedScores = projectScores(
    args.studentData.scores,
    args.percentileChange,
  );
  return cloneAndExtend(args.studentData, {scores: projectedScores}, {gradeLevel: args.targetGradeLevel});
};

const projectScores = (scores: StudentScores, percentileChange: number): StudentScores => {
  const projectedScores: StudentScores = {
    nweaPercentileMath: adjustScore({score: scores.nweaPercentileMath, scoreType: ScoreType.nweaPercentileMath, percentileChange: percentileChange}),
    nweaPercentileRead: adjustScore({score: scores.nweaPercentileRead, scoreType: ScoreType.nweaPercentileRead, percentileChange: percentileChange}),
    subjGradeMath: adjustScore({score: scores.subjGradeMath, scoreType: ScoreType.subjGradeMath, percentileChange: percentileChange}),
    subjGradeRead: adjustScore({score: scores.subjGradeRead, scoreType: ScoreType.subjGradeRead, percentileChange: percentileChange}),
    subjGradeSci: adjustScore({score: scores.subjGradeSci, scoreType: ScoreType.subjGradeSci, percentileChange: percentileChange}),
    subjGradeSocStudies: adjustScore({score: scores.subjGradeSocStudies, scoreType: ScoreType.subjGradeSocStudies, percentileChange: percentileChange}),
  };
  return projectedScores;
};

const adjustScore = (args: {score: StudentScore, scoreType: ScoreType, percentileChange: number}): number => {
  let MIN_VALUE: number;
  let MAX_VALUE: number;
  switch(args.scoreType){
    case ScoreType.nweaPercentileMath:
    case ScoreType.nweaPercentileRead:
      MIN_VALUE = 1;
      MAX_VALUE = 99;
      break;
    default:
      MIN_VALUE = 0;
      MAX_VALUE = 100;
  }

  const adjustedScore = args.score + args.percentileChange;
  if (adjustedScore > MAX_VALUE) {
    return MAX_VALUE;
  } else if (adjustedScore < MIN_VALUE) {
    return MIN_VALUE;
  } else {
    return adjustedScore;
  }
};

const average = (arr: number[]): number => {
  const count = arr.length;
  const sum = arr.reduce( (a,b) => a + b);
  return sum / count;
};

