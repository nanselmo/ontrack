import StudentData from "shared/types/student-data";
import {toLetterGrade} from "shared/util/grade-convert";
import {ritToPercentile, NWEATestType} from "shared/util/nwea-convert";

export const calculateSEPoints = (data: StudentData, additionalReqs: {SETestPercentile: number}): number => {

  let sePoints = 0;
  // calculate score component for NWEA scores
  const NWEA_SCORE_CONSTANT = 1.515;
  const mathPercentile = ritToPercentile(data.scores.nweaMath, NWEATestType.Math, data.gradeLevel);
  const readPercentile = ritToPercentile(data.scores.nweaRead, NWEATestType.Reading, data.gradeLevel);

  sePoints += mathPercentile * NWEA_SCORE_CONSTANT;
  sePoints += readPercentile * NWEA_SCORE_CONSTANT;

  // calculate score component for subjGrades
  const gradePointsLookup = {
    "A": 75,
    "B": 50,
    "C": 25,
    "D": 0,
    "F": 0,
  }
  sePoints += gradePointsLookup[toLetterGrade(data.scores.subjGradeMath)];
  sePoints += gradePointsLookup[toLetterGrade(data.scores.subjGradeRead)];
  sePoints += gradePointsLookup[toLetterGrade(data.scores.subjGradeSci)];
  sePoints += gradePointsLookup[toLetterGrade(data.scores.subjGradeSocStudies)];

  // calculate score component for SE Test percentile 
  const SE_TEST_PERCENTILE_CONSTANT = 3.03; 
  // FIXME: working around absence of additionalReqs right now
  if (additionalReqs.SETestPercentile) {
    sePoints += additionalReqs.SETestPercentile * SE_TEST_PERCENTILE_CONSTANT;
    console.warn("No SETestPercentile passed to calculateSEPoints! Matching average of NWEA Math/Read percentiles instead.");
  } else {
    sePoints += ( mathPercentile + readPercentile / 2 ) * SE_TEST_PERCENTILE_CONSTANT;
  }
  console.log(sePoints);
  return sePoints;
};

export const calculateIBPoints = (data: StudentData, additionalReqs: {attendedInfoSession: boolean}): number => {
  let ibPoints = 0;
  // calculate score component for NWEA scores 
  const NWEA_SCORE_CONSTANT = 2.2727;
  const mathPercentile = ritToPercentile(data.scores.nweaMath, NWEATestType.Math, data.gradeLevel);
  const readPercentile = ritToPercentile(data.scores.nweaRead, NWEATestType.Reading, data.gradeLevel);
  ibPoints += mathPercentile * NWEA_SCORE_CONSTANT;
  ibPoints += readPercentile * NWEA_SCORE_CONSTANT;
  
  // calculate score component for subj grades
  const gradePointsLookup = {
    "A": 112.5,
    "B": 75,
    "C": 38,
    "D": 0,
    "F": 0,
  }
  ibPoints += gradePointsLookup[data.scores.subjGradeMath];
  ibPoints += gradePointsLookup[data.scores.subjGradeRead];
  ibPoints += gradePointsLookup[data.scores.subjGradeSci];
  ibPoints += gradePointsLookup[data.scores.subjGradeSocStudies];
  
  // is student within attendance boundaries?
  // TODO: this is hard to do correctly. Can just compute flat-earth distance as a stopgap
  // until can architect a solution involving looking up coordinates in geoJSON and stuff

  return ibPoints;
};

