import HSPrograms from "shared/types/hs-programs";
import HSProgram from "shared/types/hs-program";

const loadHSPrograms = (): HSPrograms => {
  // read hs config data from json
  const allHSPrograms: HSProgram[] = JSON.parse("../../shared/data/hs_config_data.json");
  const hsPrograms: HSPrograms = groupByProgramType(allHSPrograms);
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
