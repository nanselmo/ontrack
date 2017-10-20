import StudentScores from "shared/types/student-scores";
import ScoreType from "shared/types/score-type";
import ScoreProjectionFunction from "shared/types/score-projection-function";
import ScoreTransformerSettings from "shared/types/score-transformer-settings";

// takes in ScoreProjectorValues and outputs a ScoreProjectorFunction.
// ScoreProjectorFunction transforms StudentScores and returns new StudentScores.
const createScoreProjectorFunction = (settings: ScoreTransformerSettings): ScoreProjectionFunction => {
  return function(oldScores: StudentScores): StudentScores {
    let newScores: StudentScores = {};
    for (let scoreType in oldScores) {
      const oldScore = oldScores[scoreType];
      const transformerSetting = settings[scoreType];
      newScores[scoreType] = transformScore(oldScore, transformerSetting, scoreType as ScoreType); 
    }
    return newScores;

  };
};

// TODO: this is a mock
const transformScore = (oldScore: number, setting: number, scoreType: ScoreType) => {
  return oldScore + setting;
}

export default createScoreProjectorFunction; 
