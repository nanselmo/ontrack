import StudentScores from "shared/types/student-scores";

export default interface StudentInfo {
  address?: string
  tier?: number
  gradeLevel?: number 
  ell?: boolean
  iep?: boolean
  scores?: StudentScores
}
