import * as React from "react"
import {connect} from "react-redux";
import NumberField from "shared/components/ui/fields/number-field";
import between from "shared/util/limiters/between";
import AppState from "shared/types/app-state";
import ScoreType from "shared/types/score-type";

import { updateStudentScore } from "shared/actions";

const INPUT_DEBOUNCE_TIME = 250; //ms

import "./student-data-form.scss";

import IEPInputContainer from "./iep-input-container";
import ELLInputContainer from "./ell-input-container";
import GenderInputContainer from "./gender-input-container";
import LocationInputContainer from "./location-input-container";
import GradeLevelInputContainer from "./grade-level-input-container";
import AttendPercentageInputContainer from "./attend-percentage-input-container";
import CurrESProgramInputContainer from "./curr-es-program-input-container";
import SiblingHSProgramInputContainer from "./sibling-hs-program-input-container";
import ScoreInputFactory from "./score-input-factory";


import {
  updateStudentNWEAPercentileMath
} from "shared/actions";

const Form = (props) => (
  <div className="student-data-form">
    {props.children}
  </div>
);

const SubForm = (props) => (
  <div className="student-data-form-subform">
    <div className="student-data-form-subheader"> 
      {props.label}
    </div>
    {props.children}
  </div>
);


const mapStateScore = (scoreType: ScoreType) => (state: AppState) => {
  return { 
    value: state.getIn(['studentData', scoreType]) 
  };
}
const mapDispatchScore = (scoreType: ScoreType) => (dispatch) => {
  return { 
    onChange: (value) => dispatch(updateStudentScore(scoreType, value)) 
  }
};

const connectScore = (scoreType: ScoreType) => (elem) => {
  return connect(
    mapStateScore(scoreType),
    mapDispatchScore(scoreType)
  )(elem);
}

const StudentDataForm = (props) => {

  return (
    <Form>
      <SubForm label="Your student information">
        <GenderInputContainer/>
        <IEPInputContainer/>
        <ELLInputContainer/>
        <GradeLevelInputContainer/>
        <LocationInputContainer/>
        <AttendPercentageInputContainer/>
        <CurrESProgramInputContainer/>
        <SiblingHSProgramInputContainer/>
      </SubForm>
      <SubForm label="Your grades">
        { connectScore('nweaPercentileMath')( (props) => {
            return <NumberField
              label="NWEA Math percentile"
              value={props.value}
              onChange={props.onChange}
              limiter={between(1, 99)}
              debounceTime={INPUT_DEBOUNCE_TIME}
            />
          } ) 
        }
        { connectScore('nweaPercentileRead')( (props) => { 
            return <NumberField
              label="NWEA Reading percentile"
              value={props.value}
              onChange={props.onChange}
              limiter={between(1, 99)}
              debounceTime={INPUT_DEBOUNCE_TIME}
            /> 
          } )
        }
        { connectScore('subjGradeMath')( (props) => {
            return <NumberField
              label="Math"
              value={props.value}
              onChange={props.onChange}
              limiter={between(0, 100)}
              debounceTime={INPUT_DEBOUNCE_TIME}
            />
          } )
        }
        { connectScore('subjGradeRead')( (props) => {
            return <NumberField
              label="Reading"
              value={props.value}
              onChange={props.onChange}
              limiter={between(0, 100)}
              debounceTime={INPUT_DEBOUNCE_TIME}
            />
          } )
        }
        { connectScore('subjGradeSci')( (props) => {
            return <NumberField
              label="Science"
              value={props.value}
              onChange={props.onChange}
              limiter={between(0, 100)}
              debounceTime={INPUT_DEBOUNCE_TIME}
            />
          } )
        }
        { connectScore('subjGradeSocStudies')( (props) => {
            return <NumberField
              label="Social Studies"
              value={props.value}
              onChange={props.onChange}
              limiter={between(0, 100)}
              debounceTime={INPUT_DEBOUNCE_TIME}
            />
          } )
        }
      </SubForm>
    </Form>
  );
};

export default StudentDataForm;
