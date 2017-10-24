import StudentScores from "shared/types/student-scores";

type ScoreProjectionFunction = (scores: StudentScores, percentileChange: number, gradeLevel: number) => StudentScores;

export default ScoreProjectionFunction;

