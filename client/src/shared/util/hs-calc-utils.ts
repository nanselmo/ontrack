import StudentData from "shared/types/student-data";
import {toLetterGrade} from "shared/util/grade-convert";
import {NWEATestType} from "shared/util/nwea-convert";

export const calculateSEPoints = (student: StudentData): number => {

  // calculate points for NWEA scores
  const NWEA_SCORE_CONSTANT = 1.515;
  const nweaMathPoints = Math.round(student.scores.nweaPercentileMath * NWEA_SCORE_CONSTANT);
  const nweaReadPoints = Math.round(student.scores.nweaPercentileRead * NWEA_SCORE_CONSTANT);

  // calculate points for subjGrades
  const gradePointsLookup = {
    "A": 75,
    "B": 50,
    "C": 25,
    "D": 0,
    "F": 0,
  }
  const subjGradeMathPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeMath)];
  const subjGradeReadPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeRead)];
  const subjGradeSciPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeSci)];
  const subjGradeSocStudiesPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeSocStudies)];

  // calculate score component for SE Test percentile 
  const SE_TEST_PERCENTILE_CONSTANT = 3.03; 
  const seTestPoints = Math.round(student.seTestPercentile * SE_TEST_PERCENTILE_CONSTANT);
  
  const sePoints = nweaMathPoints +
    nweaReadPoints +
    subjGradeMathPoints +
    subjGradeReadPoints + 
    subjGradeSciPoints +
    subjGradeSocStudiesPoints +
    seTestPoints;

  return sePoints;
};

export const calculateIBPoints = (student: StudentData): number => {
  // calculate points for NWEA scores
  const NWEA_SCORE_CONSTANT = 2.2727;
  const nweaMathPoints = Math.round(student.scores.nweaPercentileMath * NWEA_SCORE_CONSTANT);
  const nweaReadPoints = Math.round(student.scores.nweaPercentileRead * NWEA_SCORE_CONSTANT);

  // calculate score component for subj grades
  const gradePointsLookup = {
    "A": 112.5,
    "B": 75,
    "C": 38,
    "D": 0,
    "F": 0,
  }
  const subjGradeMathPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeMath)];
  const subjGradeReadPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeRead)];
  const subjGradeSciPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeSci)];
  const subjGradeSocStudiesPoints = gradePointsLookup[toLetterGrade(student.scores.subjGradeSocStudies)];
  
  const ibPoints = nweaMathPoints +
    nweaReadPoints +
    subjGradeMathPoints +
    subjGradeReadPoints + 
    subjGradeSciPoints +
    subjGradeSocStudiesPoints;

  return ibPoints;
};  