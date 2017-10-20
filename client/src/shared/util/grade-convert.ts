import StudentScores from "shared/types/student-scores"; 
import StudentScore from "shared/types/student-score";
import ScoreType from "shared/enums/score-type";

import * as NWEAConvert from "shared/util/nwea-convert";

const letterGradeHighScores = {
  A: 100,
  B: 89,
  C: 79,
  D: 69,
  F: 59
};

const createNumberRangeMapFunction = (inputRange: [number,number], outputRange: [number, number]): (number) => number => {
  return (x: number): number => {
    let inputLow, inputHigh: number;
    [inputLow, inputHigh] = inputRange;
    let outputLow, outputHigh: number;
    [outputLow, outputHigh] = outputRange;
    // ensure that x is within input range
    if (x < inputLow) {
      x = inputLow;
    } else if (x > inputHigh) {
      x = inputHigh;
    }
    // map x onto output range 
    const xMappedToOutput: number = (x - inputLow) / (inputHigh - inputLow) * (outputHigh - outputLow) + outputLow;
    return xMappedToOutput; 
  };
};

// map average grade range (50,100) onto percentile, and vice versa
const numberGradeRange = [50,100];
const percentileRange = [1,99];
const gradePercentileToNumberGrade = createNumberRangeMapFunction([1, 99], [50,100]);
const numberGradeToPercentile = createNumberRangeMapFunction([50,100], [1,99]);

export const scoreToPercentile = (score: StudentScore, scoreType: ScoreType, gradeLevel: number): number => {
  switch(scoreType) {
    case ScoreType.nweaMath:
    case ScoreType.nweaRead:
      return NWEAConvert.ritToPercentile(score, scoreType, gradeLevel);
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      return numberGradeToPercentile(score);
  }

};

export const percentileToScore = (percentile: number, scoreType: ScoreType, gradeLevel: number): StudentScore => {
  switch(scoreType) {
    case ScoreType.nweaMath:
    case ScoreType.nweaRead:
      return NWEAConvert.percentileToRit(percentile, scoreType, gradeLevel);
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      return gradePercentileToNumberGrade(percentile);
  }
};

export const scoreToString = (score: StudentScore, scoreType: ScoreType): string => {
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

export const stringToScore = (scoreString: string, scoreType: ScoreType): StudentScore => {
  switch(scoreType) {
    case ScoreType.nweaMath:
    case ScoreType.nweaRead:
      return Number.parseInt(scoreString, 10);
    case ScoreType.subjGradeMath:
    case ScoreType.subjGradeRead:
    case ScoreType.subjGradeSci:
    case ScoreType.subjGradeSocStudies:
      return toNumberGrade(scoreString);
  }
}
export const isLetterGrade = (strScore: string): boolean => {
  const letterGrades = ["A", "B", "C", "D", "F"];
  if (letterGrades.indexOf(strScore.toUpperCase()) !== -1) {
    return true;
  } else {
    return false;
  }
};

export const isNumberGrade = (strScore: string): boolean => {
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

export const toNumberGrade = (strScore: string): number => {
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

// FIXME: this is a mock
export const toGPA = (scores: StudentScores): string => {
  return "3.0";
};

