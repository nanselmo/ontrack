import * as React from "react";

import StudentScores from "shared/types/student-scores";

interface ScoreProjectorProps {
  onChange: (StudentScores) => any
}

const ScoreProjector = (props: ScoreProjectorProps) => {
  return (
    <div>
      {props.onChange}
    </div>
  )

}; 

export default ScoreProjector;
