import * as React from "react";

import { INPUT_DEBOUNCE_TIME } from "shared/constants";
import between from "shared/util/limiters/between";
import ScoreType from "shared/enums/score-type";
import connectScoreType from "./connect-score-type";

import NumberField from "shared/components/ui/fields/number-field";

const Field = (props) => {
  return <NumberField
    label="Social Studies Grade"
    value={props.value}
    onChange={props.onChange}
    limiter={between(0, 100)}
    debounceTime={INPUT_DEBOUNCE_TIME}
  />
}

export default connectScoreType(ScoreType.subjGradeSocStudies)(Field);
