import * as React from "react";

import ScoreType from "shared/types/score-type";
import ScoreTransformerSettings from "shared/types/score-transformer-settings";
import ScoreTransformerFunction from "shared/types/score-transformer-function";

import ScoreTransformerInputContainer from "./score-transformer-input-container";
import createScoreTransformerFunction from "./create-score-transformer-function";

interface ScoreTransformerProps {
  onChange: (ScoreTransformerFunction) => any
}

interface ScoreTransformerState {
  settings: ScoreTransformerSettings
  onChange: (ScoreTransformerFunction) => any
}

class ScoreTransformer extends React.PureComponent<ScoreTransformerProps, ScoreTransformerState> {

  constructor(props) {
    super(props);
    const defaultSettings: ScoreTransformerSettings = {
      nweaMath: 50,
      nweaRead: 50,
      subjGradeMath: 50,
      subjGradeRead: 50,
      subjGradeSci: 50,
      subjGradeSocStudies: 50,
    };
    this.state = {
      settings: defaultSettings,
      onChange: props.onChange
    };
  }

  componentDidMount() {
    const transformerFunction = this.createTransformerFunction(this.state.settings);
    this.state.onChange(transformerFunction);
    console.log("ScoreTransformer updated");
    console.log(this.state);
  }

  private createTransformerFunction(settings: ScoreTransformerSettings): ScoreTransformerFunction {
    return createScoreTransformerFunction(settings);
  }

  private handleSettingsChange(newSettings: ScoreTransformerSettings) {
    this.setState({settings: newSettings});
    const transformerFunction = this.createTransformerFunction(this.state.settings);
    this.state.onChange(transformerFunction);
  }

  render() {
    return (
      <ScoreTransformerInputContainer 
        settings={this.state.settings} 
        onChange={this.handleSettingsChange.bind(this)} />
    )
  }

  //onChange={this.handleSettingsChange.bind(this)}
}

export default ScoreTransformer;
