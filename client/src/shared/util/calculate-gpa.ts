import {toGPA} from "shared/util/grade-convert";

const calculateGPA = (scores): number => {
  return toGPA([scores.subjGradeMath, 
    scores.subjGradeRead, 
    scores.subjGradeSci, 
    scores.subjGradeSocStudies]);
};

export default calculateGPA;
