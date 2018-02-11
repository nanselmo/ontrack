import * as React from "react";
import { connect } from "react-redux";
import { List, Map } from "immutable";
import { createSelector } from "reselect";

import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";
import HSProgram from "shared/types/hs-program";
import SuccessChance from "shared/enums/success-chance";

import HSProgramList from "./hs-program-list";

import { selectHSProgram } from "shared/actions";


interface Outcomes {
  [id: string]: {
    application: SuccessChance
    selection: SuccessChance
  }
};

const getPrograms = (state: AppState): List<CPSProgram> => state.getIn(['hsData', 'programs']);
const getProgramIndex = (state: AppState): {[id: string]: number} => state.getIn(['hsData', 'index']);
const getHSProgramIDsByType = (state: AppState): Map<string, Map<string, any>> => state.getIn(['hsData', 'hsProgramIDsByType']);
const getOutcomes = (state: AppState): Outcomes => state.getIn(['hsData', 'outcomes']);

const toHSPrograms = (cpsPrograms: CPSProgram[], outcomes): HSProgram[] => {
  return cpsPrograms.map( cpsProgram => {
    return {
      id: cpsProgram.ID,
      longname: cpsProgram.Long_Name,
      shortname: cpsProgram.Short_Name,
      programType: cpsProgram.Program_Type,

      applicationReqDescription: cpsProgram.Application_Requirements,
      applicationOutcome: outcomes.getIn([cpsProgram.ID, 'application']),
      selectionReqDescription: cpsProgram.Program_Selections,
      selectionOutcome: outcomes.getIn([cpsProgram.ID, 'selection']),
      
      cpsLink: cpsProgram.CPS_School_Profile,
      schoolPageLink: cpsProgram.Website,
      hsBoundLink: ""
    }
  });
};

const selectPrograms = (ids, allPrograms, index): CPSProgram[] => {
  let selectedPrograms = [];
  ids.forEach( id => {
    // use index to find cps program corresponding to id
    const i = index.get(id);
    const program = allPrograms.get(i);
    selectedPrograms.push(program);
  });
  return selectedPrograms;
};

const selectHSProgramsByType = createSelector(
  [getHSProgramIDsByType, getPrograms, getProgramIndex, getOutcomes],
  (idsByType, allPrograms, index, outcomes) => {
    console.log(idsByType);
    console.log(outcomes);
    let hsProgramsByType = {}; 
    idsByType.forEach( (ids, programType)=> {
      const cpsPrograms: CPSProgram[] = selectPrograms(ids, allPrograms, index);
      const hsPrograms = toHSPrograms(cpsPrograms, outcomes);
      // TODO sort hsPrograms on outcome
      hsProgramsByType[programType] = hsPrograms;
    });
    return hsProgramsByType;
  }
);

const mapStateToProps = (state: AppState) => {
  return {
    hsProgramsByType: selectHSProgramsByType(state),
    selectedProgramID: state.get('selectedHSProgramID')
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectedProgramIDChange: (newID: string) => dispatch(selectHSProgram(newID))
  }
};

const HSProgramsContainer = connect(mapStateToProps, mapDispatchToProps)(HSProgramList);

export default HSProgramsContainer;


