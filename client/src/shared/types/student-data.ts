import StudentScores from "shared/types/student-scores";

export default interface StudentInfo {
  studentFirstName: string,
  studentLastName: string,
  address: string
  tier: number
  gradeLevel: number 
  ell: boolean
  iep: boolean
  scores: StudentScores
}
