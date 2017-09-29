import StudentScores from "shared/types/student-scores"; 

const letterGradeLowScores = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 50
};

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
    return letterGradeLowScores[strScore];
  } else {
    throw new Error(`toNumberGrade parse failed with ${strScore}`);
  }
};

// TODO: double check this is right
export const toLetterGrade = (grade: number): string => {
  if (grade >= letterGradeLowScores["A"]) {
    return "A";
  } else if (grade >= letterGradeLowScores["B"]) {
    return "B";
  } else if (grade >= letterGradeLowScores["C"]) {
    return "C";
  } else if (grade >= letterGradeLowScores["D"]) {
    return "D";
  } else if (grade >= letterGradeLowScores["F"]) {
    return "F";
  }
};

// FIXME: this is a mock
export const toGPA = (scores: StudentScores): string => {
  return "3.0";
};

