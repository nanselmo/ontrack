import * as React from "react";
import { connect } from "react-redux";

import { updateStudentELLStatus } from "shared/actions";
import AppState from "shared/types/app-state";

import DropdownField from "shared/components/ui/fields/dropdown-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
<DropdownField
  label="Are you an English Language Learner?"
  value={props.ell ? "true" : "false"}
  onChange={ ell => props.onChange(ell === "true" ? true : false) }
  debounceTime={INPUT_DEBOUNCE_TIME}
  >
  <option value="true">Yes</option>
  <option value="false">No</option>
</DropdownField>
);

const mapStateToProps = (state: AppState) => {
  return {
    ell: state.getIn(['studentData', 'ell'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: ell => dispatch(updateStudentELLStatus(ell))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
