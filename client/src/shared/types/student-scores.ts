import StudentScore from "shared/types/student-score";

export default interface StudentScores {
  nweaMath?: StudentScore
  nweaRead?: StudentScore
  nweaPercentileMath?: StudentScore
  nweaPercentileRead?: StudentScore
  subjGradeMath?: StudentScore 
  subjGradeRead?: StudentScore
  subjGradeSci?: StudentScore
  subjGradeSocStudies?: StudentScore
}
