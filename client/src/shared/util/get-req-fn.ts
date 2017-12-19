import HsReqFn from "shared/types/hs-req-fn";

import HsReqFns from "shared/data/hs_req_fns.ts";

const getReqFn = (id: string): HsReqFn => {
  // debug
  try {
    return HsReqFns[id].fn;
  } catch(e) {
    console.log(id);
  }
};

export default getReqFn;
