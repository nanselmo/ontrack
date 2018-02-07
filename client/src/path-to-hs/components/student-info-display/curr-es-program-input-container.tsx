import * as React from "react";
import { connect } from "react-redux";

import { updateStudentCurrESProgram } from "shared/actions";
import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";

import ComboBoxField  from "shared/components/ui/fields/combo-box-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
  <ComboBoxField
    label="What elementary school program are you in now?"
    value={props.currESProgramID}
    data={
      { 
        records: props.esPrograms, 
        getKey: (program) => program.ID, 
        getDisplayText: (program) => program.Short_Name + " - " + program.Program_Type 
      }
    }
    onChange={ (program: CPSProgram) => props.onChange(program.ID)}
    debounceTime={INPUT_DEBOUNCE_TIME}
  /> 
);

const mapStateToProps = (state: AppState) => {
  return {
    currESProgramID: state.getIn(['studentData', 'currESProgramID']),
    esPrograms: [],
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: programID => dispatch(updateStudentCurrESProgram(programID))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
