import * as React from "react";
import { connect } from "react-redux";

import { updateStudentGradeLevel } from "shared/actions";
import AppState from "shared/types/app-state";
import DropdownField from "shared/components/ui/fields/dropdown-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => <DropdownField
  label="What grade are you in?"
  value={ props.gradeLevel && props.gradeLevel.toString()}
  onChange={(gradeStr: string) => props.onChange(parseInt(gradeStr)) }
  debounceTime={props.debounceTime}
  >
  <option value="4">4th grade</option>
  <option value="5">5th grade</option>
  <option value="6">6th grade</option>
  <option value="7">7th grade</option>
  <option value="8">8th grade</option>
</DropdownField>;

const mapStateToProps = (state: AppState) => {
  return {
    gradeLevel: state.getIn(['studentData', 'gradeLevel'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: gradeLevel => dispatch(updateStudentGradeLevel(gradeLevel))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
