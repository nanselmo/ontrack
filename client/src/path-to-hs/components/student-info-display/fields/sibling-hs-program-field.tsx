import * as React from "react";
import { connect } from "react-redux";
import { List, Map } from "immutable";
import { createSelector } from "reselect";

import { updateStudentSiblingHSPrograms } from "shared/actions";
import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";

import MultiSelectField from "shared/components/ui/fields/multi-select-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
  <MultiSelectField
    label="Do you have a sibling in high school? If so, which school?"
    values={props.siblingHSPrograms}
    data={
      {
        records: props.hsPrograms, 
        getKey: (program) => program.ID, 
        getDisplayText: (program) => {
          return program.Short_Name + " - " + program.Program_Type;
        }
      }
    }
    onChange={ (programs: CPSProgram[]) => props.onChange(programs.map( program => program.ID ) )}
    debounceTime={INPUT_DEBOUNCE_TIME}
  /> 
);

const getPrograms = (state: AppState): List<CPSProgram> => state.getIn(['hsData', 'programs']);
const getProgramIndex = (state: AppState): Map<string, number> => state.getIn(['hsData', 'index']);
const getHSProgramIDs = (state: AppState): List<string> => state.getIn(['hsData', 'hsProgramIDs']);
const getSiblingHSProgramIDs = (state: AppState): List<string> => state.getIn(['studentData', 'siblingHSProgramIDs']);


const selectPrograms = (ids, allPrograms, index): CPSProgram[] => {
    let selectedPrograms = [];
    ids.forEach( id => {
      console.log(id);
      // use index to find cps program corresponding to id
      const i = index.get(id);
      const program = allPrograms.get(i);
      selectedPrograms.push(program);
    });
    return selectedPrograms;
};

const selectHSPrograms = createSelector( 
  [getHSProgramIDs, getPrograms, getProgramIndex], 
  selectPrograms
);

const selectSiblingHSPrograms = createSelector(
  [getSiblingHSProgramIDs, getPrograms, getProgramIndex],
  selectPrograms
);

const mapStateToProps = (state: AppState) => {
  return {
    siblingHSPrograms: selectSiblingHSPrograms(state),
    hsPrograms: selectHSPrograms(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: programIDs => {
      console.log(programIDs);
      dispatch(updateStudentSiblingHSPrograms(programIDs))
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Field);
