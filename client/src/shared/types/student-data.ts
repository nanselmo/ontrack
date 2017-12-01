import StudentScores from "shared/types/student-scores";
import AdditionalRequirements from "shared/types/additional-requirements";

export default interface StudentInfo {
  studentFirstName: string,
  studentLastName: string,
  address: string
  tier: string
  gradeLevel: number 
  ell: boolean
  iep: boolean
  attendancePercentage: number
  gpa: number
  scores: StudentScores
}
