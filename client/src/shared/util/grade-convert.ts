import ScoreType from "shared/enums/score-type";

import { 
  percentileToRit, 
  NWEATestType,
  NWEAConvertErrors} from "shared/util/nwea-convert";

export const GradeConvertErrors = {
  BadScoreType: new Error("Incorrect ScoreType passed to GradeConvert method"),
  BadScore: new Error("Bad score passed to GradeConvert method"),
  BadPercentile: new Error("Bad percentile passed to GradeConvert method")
};

// export const scoreToPercentile = (score: StudentScore, scoreType: ScoreType, gradeLevel: number): number => {
//   switch(scoreType) {
//     case ScoreType.nweaMath:
//       return ritToPercentile(score, NWEATestType.Math, gradeLevel);
//     case ScoreType.nweaRead:
//       return ritToPercentile(score, NWEATestType.Reading, gradeLevel);
//     case ScoreType.subjGradeMath:
//     case ScoreType.subjGradeRead:
//     case ScoreType.subjGradeSci:
//     case ScoreType.subjGradeSocStudies:
//       return numberGradeToPercentile(score);
//     default:
//       throw GradeConvertErrors.BadScoreType;
//   }
// };

// export const percentileToScore = (percentile: number, scoreType: ScoreType, gradeLevel: number): StudentScore => {
//   if(!(percentile >= 1 && percentile <= 99)) {
//     throw GradeConvertErrors.BadPercentile;
//   }
//   switch(scoreType) {
//     case ScoreType.nweaPercentileMath:
//       return percentileToRit(percentile, NWEATestType.Math, gradeLevel);
//     case ScoreType.nweaPercentileRead:
//       return percentileToRit(percentile, NWEATestType.Reading, gradeLevel);
//     case ScoreType.subjGradeMath:
//     case ScoreType.subjGradeRead:
//     case ScoreType.subjGradeSci:
//     case ScoreType.subjGradeSocStudies:
//       return gradePercentileToNumberGrade(percentile);
//     default:
//       throw GradeConvertErrors.BadScoreType;
//   }
// };

export const scoreToString = (score, scoreType: ScoreType): string => {
  if (scoreType in ScoreType) {
    return score.toString(10);
  } else {
    throw GradeConvertErrors.BadScoreType;
  }
};

export const tryParseScore = (str: string, scoreType: ScoreType): [boolean, number] => {
  if (scoreType in ScoreType) {
    const score = Number.parseInt(str, 10);
    if (Number.isNaN(score)) {
      return [false, null];
    } else {
      return [true, score];
    }
  } else {
    throw GradeConvertErrors.BadScoreType;
  }
};

export const toGPA = (scores) => {
  const toPoints = (score): number => {
    const letterGrade = toLetterGrade(score);
    switch(letterGrade){
      case "A":
        return 4;
      case "B":
        return 3;
      case "C":
        return 2;
      case "D":
        return 1;
      case "F":
        return 0;
    }
  };
  const numGrades = scores.length;
  const gradePointSum = scores.map(toPoints).reduce((a, b) => a + b);
  return gradePointSum / numGrades;
};

const letterGradeHighScores = {
  A: 100,
  B: 89,
  C: 79,
  D: 69,
  F: 59
};

const isLetterGrade = (strScore: string): boolean => {
  const letterGrades = ["A", "B", "C", "D", "F"];
  if (letterGrades.indexOf(strScore.toUpperCase()) !== -1) {
    return true;
  } else {
    return false;
  }
};

const isNumberGrade = (strScore: string): boolean => {
  const intScore: number = Number.parseInt(strScore, 10);
  const parseSuccessful = !Number.isNaN(intScore);
  if (parseSuccessful) {
    if (intScore >= 0 && intScore <= 100) {
      return true;
    }
  } else {
    return false;
  }
};

const toNumberGrade = (strScore: string): number => {
  if (isLetterGrade(strScore)) {
    return Number.parseInt(strScore);
  } else if (isNumberGrade(strScore)) {
    return letterGradeHighScores[strScore];
  } else {
    throw new Error(`toNumberGrade parse failed with ${strScore}`);
  }
};


export const toLetterGrade = (grade: number): string => {
  if (grade <= letterGradeHighScores["F"]) {
    return "F";
  } else if (grade <= letterGradeHighScores["D"]) {
    return "D";
  } else if (grade <= letterGradeHighScores["C"]) {
    return "C";
  } else if (grade <= letterGradeHighScores["B"]) {
    return "B";
  } else {
    return "A";
  }
};
