import StudentScores from "shared/types/student-scores";
export default interface StudentInfo {
  address?: string
  tier?: string
  gradeLevel?: string
  ell?: boolean
  iep?: boolean
  scores?: StudentScores
}
