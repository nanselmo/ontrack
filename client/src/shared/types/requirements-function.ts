import StudentInfo from "shared/types/student-info";
import AdditionalRequirementData from "shared/types/additional-requirement-data";

type HSRequirementsFunction = (studentInfo: StudentInfo, 
  additionalRequirements?: AdditionalRequirementData[]) => boolean;

export default HSRequirementsFunction;
