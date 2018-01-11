import StudentData from "shared/types/student-data";
import CPSProgram from "shared/types/cps-program";
import HSReqFnProgress from "shared/types/hs-req-fn-progress";
import SuccessChance from "shared/enums/success-chance";

type HSRequirementFunction = (student: StudentData, program: CPSProgram) => {outcome: SuccessChance, 
                                                                              progress?: HSReqFnProgress};

export default HSRequirementFunction;
