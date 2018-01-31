import StudentScores from "shared/types/student-scores";
import AdditionalRequirements from "shared/types/additional-requirements";
import Geolocation from "shared/types/geolocation";
import CPSProgram from "shared/types/cps-program";
import Gender from "shared/enums/gender";

type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default interface StudentInfo {
  studentFirstName: string
  studentLastName: string
  gender: Gender

  address: string
  geolocation: Geolocation
  tier: string

  gradeLevel: GradeLevel
  prevGradeLevel: GradeLevel
  currESProgram?: CPSProgram
  ell: boolean
  iep: boolean
  attendancePercentage: number
  gpa: number
  scores: StudentScores

  siblingHSPrograms: CPSProgram[]

  seTestPercentile?: number
}
