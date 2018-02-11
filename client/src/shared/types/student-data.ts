import Gender from "shared/enums/gender";
import GradeLevel from "shared/types/grade-level";
import StudentLocation from "shared/types/student-location";

export default interface StudentData {
    gender: Gender
    location: StudentLocation
    gradeLevel: number
    prevGradeLevel: number
    currESProgramID: string
    ell: boolean
    iep: boolean
    attendancePercentage: number
    gpa: number
    siblingHSProgramIDs: string[]
    seTestPercentile: number
    nweaPercentileMath: number
    nweaPercentileRead: number
    subjGradeMath: number 
    subjGradeRead: number
    subjGradeSci: number
    subjGradeSocStudies: number
}
