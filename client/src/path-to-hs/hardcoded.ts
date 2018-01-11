import StudentScores from "shared/types/student-scores";
import StudentData from "shared/types/student-data";
import Gender from "shared/enums/gender";

export const MOCK_STUDENT_SCORES: StudentScores = {
  nweaPercentileMath: 50,
  nweaPercentileRead: 50,
  subjGradeMath: 90,
  subjGradeRead: 80,
  subjGradeSci: 79,
  subjGradeSocStudies: 66 
}

export const MOCK_STUDENT_DATA: StudentData = {
  studentFirstName: "Testfella",
  studentLastName: "McGee",
  address: "4747 S Marshfield Ave, Chicago IL",
  ell: true,
  iep: false,
  gradeLevel: 8,
  tier: "4",
  scores: MOCK_STUDENT_SCORES,
  attendancePercentage: 85,
  gpa: 2.5,
  latitude: "41.8073824",
  longitude: "-87.6657907",
  gender: Gender.FEMALE,
  prevGradeLevel: 7,
  siblingHSPrograms: []
}

