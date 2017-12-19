import HSPrograms from "shared/types/hs-programs";
import HSProgram from "shared/types/hs-program";

//import hsConfigData from "../../shared/data/hs_config_data.json";
declare const require:any;
const hsConfigData = require("../../shared/data/hs_config_data.json");

export const loadHSPrograms = (): HSPrograms => {
  // read hs config data from hs_config_data.json
  const hsPrograms: HSPrograms = groupByProgramType(hsConfigData);
  return hsPrograms;
};

const groupByProgramType = (allPrograms: HSProgram[]): HSPrograms => {
  let hsPrograms: HSPrograms = {} as HSPrograms;
  for (let i = 0; i < allPrograms.length; i++) {
    const program = allPrograms[i];
    const programType = program.Program_Type;
    // sort programs into hsPrograms object based on programType property
    if (!hsPrograms[programType]) {
      hsPrograms[programType] = [];
    }
    hsPrograms[programType].push(program);
  }
  return hsPrograms;
};

