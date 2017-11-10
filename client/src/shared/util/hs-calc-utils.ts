import StudentData from "shared/types/student-data";
import {toLetterGrade} from "shared/util/grade-convert";
import {NWEATestType} from "shared/util/nwea-convert";

export const calculateSEPoints = (data: StudentData): number => {

  // calculate points for NWEA scores
  const NWEA_SCORE_CONSTANT = 1.515;
  const nweaMathPoints = Math.round(data.scores.nweaPercentileMath * NWEA_SCORE_CONSTANT);
  const nweaReadPoints = Math.round(data.scores.nweaPercentileRead * NWEA_SCORE_CONSTANT);

  // calculate points for subjGrades
  const gradePointsLookup = {
    "A": 75,
    "B": 50,
    "C": 25,
    "D": 0,
    "F": 0,
  }
  const subjGradeMathPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeMath)];
  const subjGradeReadPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeRead)];
  const subjGradeSciPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeSci)];
  const subjGradeSocStudiesPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeSocStudies)];

  // calculate score component for SE Test percentile 
  const SE_TEST_PERCENTILE_CONSTANT = 3.03; 
  // throw if no additionalReqs passed
  if (!data.additionalRequirements.SETestPercentile) {
    throw new Error("No SETestPercentile passed to calculateSEPoints!");
  }
  const seTestPoints = Math.round(data.additionalRequirements.SETestPercentile * SE_TEST_PERCENTILE_CONSTANT);
  
  const sePoints = nweaMathPoints +
    nweaReadPoints +
    subjGradeMathPoints +
    subjGradeReadPoints + 
    subjGradeSciPoints +
    subjGradeSocStudiesPoints +
    seTestPoints;

  return sePoints;
};

export const calculateIBPoints = (data: StudentData): number => {
  // calculate points for NWEA scores
  const NWEA_SCORE_CONSTANT = 2.2727;
  const nweaMathPoints = Math.round(data.scores.nweaPercentileMath * NWEA_SCORE_CONSTANT);
  const nweaReadPoints = Math.round(data.scores.nweaPercentileRead * NWEA_SCORE_CONSTANT);

  // calculate score component for subj grades
  const gradePointsLookup = {
    "A": 112.5,
    "B": 75,
    "C": 38,
    "D": 0,
    "F": 0,
  }
  const subjGradeMathPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeMath)];
  const subjGradeReadPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeRead)];
  const subjGradeSciPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeSci)];
  const subjGradeSocStudiesPoints = gradePointsLookup[toLetterGrade(data.scores.subjGradeSocStudies)];
  
  // is student within attendance boundaries?
  // TODO: this is hard to do correctly. Can just compute flat-earth distance as a stopgap
  // until can architect a solution involving looking up coordinates in geoJSON and stuff
  const ibPoints = nweaMathPoints +
    nweaReadPoints +
    subjGradeMathPoints +
    subjGradeReadPoints + 
    subjGradeSciPoints +
    subjGradeSocStudiesPoints;

  return ibPoints;
};

