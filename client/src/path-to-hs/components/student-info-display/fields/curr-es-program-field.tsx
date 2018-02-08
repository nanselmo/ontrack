import * as React from "react";
import { connect } from "react-redux";
import { List, Map } from "immutable";
import { createSelector } from "reselect";

import { updateStudentCurrESProgram } from "shared/actions";
import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";

import ComboBoxField  from "shared/components/ui/fields/combo-box-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
  <ComboBoxField
    label="What elementary school program are you in now?"
    value={props.currESProgram}
    data={
      { 
        records: props.esPrograms, 
        getKey: (program) => program.ID, 
        getDisplayText: (program: CPSProgram) => {
          return program.Short_Name + " - " + program.Program_Type;
        }
      }
    }
    onChange={ (program: CPSProgram) => props.onChange(program.ID)}
    debounceTime={INPUT_DEBOUNCE_TIME}
  /> 
);

const getPrograms = (state: AppState): List<CPSProgram> => state.getIn(['hsData', 'programs']);
const getProgramIndex = (state: AppState): Map<string, number> => state.getIn(['hsData', 'index']);
const getESProgramIDs = (state: AppState): List<string> => state.getIn(['hsData', 'esProgramIDs']);
const getCurrESProgramID = (state: AppState): string => state.getIn(['studentData', 'currESProgramID']);

const selectESPrograms = createSelector( 
  [getESProgramIDs, getPrograms, getProgramIndex], 
  (ids, programs, index) => {
    let esPrograms = [];
    ids.forEach( id => {
      // use index to find cps program corresponding to id
      const i = index.get(id);
      const program = programs.get(i);
      esPrograms.push(program);
    });
    return esPrograms;
  }
);

const selectCurrESProgram = createSelector(
  [getCurrESProgramID, getPrograms, getProgramIndex],
  (id, programs, index) => {
    const i = index.get(id);
    const program = programs.get(i);
    return program;
  }
);

const mapStateToProps = (state: AppState) => {
  return {
    currESProgram: selectCurrESProgram(state),
    esPrograms: selectESPrograms(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: programID => {
      dispatch(updateStudentCurrESProgram(programID))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
