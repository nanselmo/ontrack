import Gender from "shared/enums/gender";
import Geolocation from "shared/types/geolocation";

interface AppState {

  studentData: {
    gender: Gender
    location: {address: string, tier: string, geo: Geolocation}
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
  },

  // HS list
  selectedHSProgramID: string | null
}

export default AppState;
