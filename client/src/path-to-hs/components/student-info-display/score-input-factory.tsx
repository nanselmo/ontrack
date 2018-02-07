import * as React from "react";
import { connect } from "react-redux";

import { 
  updateStudentNWEAPercentileMath,
  updateStudentNWEAPercentileRead,
  updateStudentSubjGradeMath,
  updateStudentSubjGradeRead,
  updateStudentSubjGradeSci,
  updateStudentSubjGradeSocStudies,
  updateStudentSETestPercentile
} from "shared/actions";

import AppState from "shared/types/app-state";

import NumberField from "shared/components/ui/fields/number-field";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";
import Limiter from "shared/types/limiter";
import between from "shared/util/limiters/between";

type ScoreType = "nweaPercentileMath" |
  "nweaPercentileRead" |
  "subjGradeMath" |
  "subjGradeRead" |
  "subjGradeSci" |
  "subjGradeSocStudies" |
  "seTestPercentile";

interface ScoreInputFactoryProps {
  limiter: Limiter<number>
  scoreType: ScoreType
}

const ScoreInputFactory = (props: ScoreInputFactoryProps) => {

  const mapStateToProps = (state: AppState) => {
    return {
      value: state.getIn(['studentData', props.scoreType])
    }
  };

  let action;
  switch(props.scoreType) {
    case "nweaPercentileMath":
      action = updateStudentNWEAPercentileMath;
      break;
    case "nweaPercentileRead" :
      action = updateStudentNWEAPercentileRead;
      break;
    case "subjGradeMath" :
      action = updateStudentSubjGradeMath;
      break;
    case "subjGradeRead" :
      action = updateStudentSubjGradeRead;
      break;
    case "subjGradeSci" :
      action = updateStudentSubjGradeSci;
      break;
    case "subjGradeSocStudies":
      action = updateStudentSubjGradeSocStudies;
      break;
    case "seTestPercentile":
      action = updateStudentSETestPercentile;
    default:
      throw new Error(`Unrecognized ScoreType: ${props.scoreType}`);
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      onChange: value => dispatch(action(value))
    }
  };


  const Field = (props) => <NumberField
    label="NWEA Math percentile"
    value={props.value}
    onChange={props.onChange}
    limiter={between(1, 99)}
    debounceTime={INPUT_DEBOUNCE_TIME}
  />;

  return connect(mapStateToProps, mapDispatchToProps)(Field);

}

export default ScoreInputFactory;
