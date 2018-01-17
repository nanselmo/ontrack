import HSRequirementFunction from "shared/types/hs-requirement-function";
import CPSProgram from "shared/types/cps-program";
import HSReqFns from "shared/data/hs_req_fns.ts";
import SuccessChance from "shared/enums/success-chance";


const getReqFn = (program: CPSProgram): {application: HSRequirementFunction, selection: HSRequirementFunction} => {

  const applFnID = program.Application_Requirements_Fn;
  const selFnID = program.Program_Selections_Fn;
  const defaultReqFn: HSRequirementFunction = (student, program) => {
    return {outcome: SuccessChance.NOTIMPLEMENTED};
  };

  let applicationReqFn;
  let selectionReqFn;
  if (HSReqFns[applFnID]) {
    applicationReqFn = HSReqFns[applFnID].fn;
  } else {
    console.warn(`Cannot locate application requirement for ${program.Short_Name + " - " + program.Program_Type}`);
    applicationReqFn = defaultReqFn;
  }
  if (HSReqFns[selFnID]) {
    selectionReqFn = HSReqFns[selFnID].fn;
  } else {
    console.warn(`Cannot locate selection requirement for ${program.Short_Name + " - " + program.Program_Type}`);
    selectionReqFn = defaultReqFn;
  }

  return {application: applicationReqFn, selection: selectionReqFn};
};
                                        


export default getReqFn;
