import StudentData from "shared/types/student-data";
import HSProgram from "shared/types/hs-program";
import HSReqFnProgress from "shared/types/hs-req-fn-progress";
import SuccessChance from "shared/enums/success-chance";

type RequirementFunction = (student: StudentData, program: HSProgram) => {outcome: SuccessChance, 
                                                                              progress?: HSReqFnProgress};

export default RequirementFunction;
