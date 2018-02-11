import * as React from "react";
import { connect } from "react-redux";

import { updateStudentLocation } from "shared/actions";
import AppState from "shared/types/app-state";
import AddressTierCalculator from "./address-tier-calculator";

const Field = (props) => (
  <AddressTierCalculator
    location={props.location}
    onLocationChange={props.onChange}
  />
);

const mapStateToProps = (state: AppState) => {
  return {
    location: state.getIn(['studentData', 'location'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: location => dispatch(updateStudentLocation(location))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
