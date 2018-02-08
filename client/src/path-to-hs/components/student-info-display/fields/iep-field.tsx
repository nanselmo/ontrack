import * as React from "react";
import { connect } from "react-redux";

import { updateStudentIEPStatus } from "shared/actions";
import AppState from "shared/types/app-state";

import DropdownField from "shared/components/ui/fields/dropdown-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
  <DropdownField
    label="Do you have an IEP?"
    value={props.iep ? "true" : "false"}
    onChange={ iep => props.onChange(iep === "true" ? true : false) }
    debounceTime={INPUT_DEBOUNCE_TIME}
    >
    <option value="true">Yes</option>
    <option value="false">No</option>
  </DropdownField>
);

const mapStateToProps = (state: AppState) => {
  return {
    iep: state.getIn(['studentData', 'iep'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: iep => dispatch(updateStudentIEPStatus(iep))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
