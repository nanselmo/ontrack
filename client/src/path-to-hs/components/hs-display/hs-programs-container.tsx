import * as React from "react";
import {connect} from "react-redux";

import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";
import HSProgram from "shared/types/hs-program";
import SuccessChance from "shared/enums/success-chance";
import denormalize from "shared/util/denormalize";

import HSProgramList from "./hs-program-list";

import {selectHSProgram} from "shared/actions";

interface Outcomes {
  [id: string]: {
    application: SuccessChance
    selection: SuccessChance
  }
};


const mapStateToProps = (state: AppState) => {

  const toHSProgram = (cpsProgram: CPSProgram, outcomes: Outcomes): HSProgram => {
    return {
      id: cpsProgram.ID,
      longname: cpsProgram.Long_Name,
      shortname: cpsProgram.Short_Name,
      programType: cpsProgram.Program_Type,

      applicationReqDescription: cpsProgram.Application_Requirements,
      applicationOutcome: outcomes[cpsProgram.ID].application,
      selectionReqDescription: cpsProgram.Program_Selections,
      selectionOutcome: outcomes[cpsProgram.ID].selection,
      
      cpsLink: cpsProgram.CPS_School_Profile,
      schoolPageLink: cpsProgram.Website,
      hsBoundLink: ""
    }
  };

  let hsProgramsByType = {};

  const programIDsByType = state.hsData.hsProgramIDsByType;
  Object.keys(programIDsByType).forEach( programType => {
    const programIDs: string[] = programIDsByType[programType];
    // look up programs using index
    const programs = programIDs.map( id => denormalize(id, state.hsData.programs, state.hsData.index));
    // transform programs from CPSProgram into HSProgram
    const hsPrograms = programs.map( program => {
      return toHSProgram(program, state.hsData.outcomes);
    });
    hsProgramsByType[programType] = hsPrograms;
  });

  return {
    hsProgramsByType: hsProgramsByType,
    selectedProgramID: state.selectedHSProgramID
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectedProgramIDChange: (newID: string) => dispatch(selectHSProgram(newID))
  }
};

const HSProgramsContainer = connect(mapStateToProps, mapDispatchToProps)(HSProgramList);

export default HSProgramsContainer;


