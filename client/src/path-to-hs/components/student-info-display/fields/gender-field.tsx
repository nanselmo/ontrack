import * as React from "react";
import { connect } from "react-redux";

import { updateStudentGender } from "shared/actions";
import AppState from "shared/types/app-state";
import Gender from "shared/enums/gender";

import DropdownField from "shared/components/ui/fields/dropdown-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";

const Field = (props) => (
  <DropdownField
    label="What's your gender?"
    value={props.gender && props.gender.toString()}
    onChange={ (gender: string) => {
      switch(gender) {
        case "male":
          props.onChange(Gender.MALE);
          break;
        case "female":
          props.onChange(Gender.FEMALE);
          break;
        case "other":
          props.onChange(Gender.OTHER);
          break;
        case "noanswer":
          props.onChange(Gender.NOANSWER);
          break;
        default:
          console.warn(`unrecognized gender: ${gender}`);
          break;
      }
    } }
    debounceTime={INPUT_DEBOUNCE_TIME}
  >
    <option value={"male"}>Boy</option>
    <option value={"female"}>Girl</option>
    <option value={"other"}>Other</option>
    <option value={"noanswer"}>Prefer not to answer</option>
  </DropdownField> 
);

const mapStateToProps = (state: AppState) => {
  return {
    gender: state.getIn(['studentData', 'gender'])
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: gender => dispatch(updateStudentGender(gender))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
