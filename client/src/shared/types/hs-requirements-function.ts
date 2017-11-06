import StudentData from "shared/types/student-data";
import AdditionalRequirementData from "shared/types/additional-requirement-data";

type HSRequirementsFunction = (studentData: StudentData, 
  additionalRequirements?: any) => boolean;

export default HSRequirementsFunction;
