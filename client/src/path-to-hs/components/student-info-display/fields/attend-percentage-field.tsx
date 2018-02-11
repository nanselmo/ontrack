import * as React from "react";
import { connect } from "react-redux";

import { updateStudentAttendPercentage } from "shared/actions";
import AppState from "shared/types/app-state";

import NumberField from "shared/components/ui/fields/number-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";
import between from "shared/util/limiters/between";

const Field = (props) => (
  <NumberField
    label="Your 7th grade attendance percentage"
    value={props.attendancePercentage}
    onChange={props.onChange}
    limiter={between(0, 100)}
    debounceTime={INPUT_DEBOUNCE_TIME}
  />
);

const mapStateToProps = (state: AppState) => {
  return {
    attendancePercentage: state.getIn(['studentData', 'attendancePercentage'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: location => dispatch(updateStudentAttendPercentage(location))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
