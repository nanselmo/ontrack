import * as React from "react";
import { connect } from "react-redux";

import { updateStudentSiblingHSPrograms } from "shared/actions";
import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";

import denormalize from "shared/util/denormalize";

import MultiSelectField from "shared/components/ui/fields/multi-select-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
  <MultiSelectField
    label="Do you have a sibling in high school? If so, which school?"
    values={props.siblingHSProgramIDs}
    data={{records: props.hsPrograms, getKey: (program) => program.ID, getDisplayText: (program) => program.Short_Name + " - " + program.Program_Type }}
    onChange={ (programs: CPSProgram[]) => props.onChange(programs.map( program => program.ID ) )}
    debounceTime={INPUT_DEBOUNCE_TIME}
  /> 
);

const mapStateToProps = (state: AppState) => {
  console.log(state.get('hsData')['hsProgramIDs']);
  return {
    siblingHSProgramIDs: state.getIn(['studentData', 'siblingHSProgramIDs']),
    hsPrograms: state.get('hsData').hsProgramIDs.map( id => denormalize(id, state.get('hsData').programs, state.get('hsData').index) )
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: programIDs => dispatch(updateStudentSiblingHSPrograms(programIDs))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
