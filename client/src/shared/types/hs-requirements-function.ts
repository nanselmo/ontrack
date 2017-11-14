import StudentData from "shared/types/student-data";
import AdditionalRequirements from "shared/types/additional-requirements";

type HSRequirementsFunction = (studentData: StudentData,
                               addlReqs: AdditionalRequirements) => boolean;

export default HSRequirementsFunction;
