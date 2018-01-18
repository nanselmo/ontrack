import StudentScores from "shared/types/student-scores";
import {toGPA} from "shared/util/grade-convert";

const calculateGPA = (scores: StudentScores): number => {
  return toGPA([scores.subjGradeMath, 
    scores.subjGradeRead, 
    scores.subjGradeSci, 
    scores.subjGradeSocStudies]);
};

export default calculateGPA;
