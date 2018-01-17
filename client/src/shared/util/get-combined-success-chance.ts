import SuccessChance from "shared/enums/success-chance";
import getReqFns from "shared/util/get-req-fns";

const getCombinedSuccessChance = (student, program): SuccessChance => {
  const reqFns = getReqFns(program);
  const applicationSuccess = reqFns.application(student, program).outcome;
  const selectionSuccess = reqFns.selection(student, program).outcome;
  if (applicationSuccess === SuccessChance.CERTAIN || applicationSuccess === SuccessChance.LIKELY) {
    return selectionSuccess;
  } else {
    return applicationSuccess;
  }
};

export default getCombinedSuccessChance;
