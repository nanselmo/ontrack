import HSRequirementFunction from "shared/types/hs-requirement-function";

import HsReqFns from "shared/data/hs_req_fns.ts";

const getReqFn = (id: string): HSRequirementFunction => {
  // debug
  try {
    return HsReqFns[id].fn;
  } catch(e) {
    console.log(id);
  }
};

export default getReqFn;
