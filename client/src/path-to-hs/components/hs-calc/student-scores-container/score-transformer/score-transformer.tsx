import * as React from "react";

import ScoreType from "shared/types/score-type";
import ScoreTransformerSettings from "shared/types/score-transformer-settings";
import ScoreTransformerFunction from "shared/types/score-transformer-function";
import Box from "shared/components/layout/box";
import clone from "shared/util/clone";

import createScoreTransformerFunction from "./create-score-transformer-function";
import TransformerSettingInput from "./transformer-setting-input";

import "./score-transformer.scss";

interface ScoreTransformerProps {
  onChange: (ScoreTransformerFunction) => any;
}

interface ScoreTransformerState {
  onChange: (ScoreTransformerFunction) => any;
  settings: ScoreTransformerSettings
}

class ScoreTransformer extends React.Component<ScoreTransformerProps, ScoreTransformerState> {

  constructor(props) {
    super(props);
    this.state = {
      onChange: props.onChange,
      settings: {
        nweaMath: 50,
        nweaRead: 50,
        subjGradeMath: 50,
        subjGradeRead: 50,
        subjGradeSci: 50,
        subjGradeSocStudies: 50
      }
    }
  }

  private createOnChange = (scoreType: ScoreType): (value: number) => any => {
    const handler = (value: number) => {
      if (this.state.settings[scoreType] !== value) {
        const settings = clone(this.state.settings);
        settings[scoreType] = value;
        const transformerFunction = createScoreTransformerFunction(settings);
        this.setState({
          settings: settings
        });
        this.state.onChange(transformerFunction);
      }
    };
    return handler;
  }

  render(){
    return (
      <div className="score-transformer-input-container">

        <div id="projector-select-container projector-nwea-math">
          <TransformerSettingInput 
            value={this.state.settings[ScoreType.nweaMath]} 
            onChange={this.createOnChange(ScoreType.nweaMath)}/>
        </div>
        <div id="projector-select-container projector-nwea-read">
          <TransformerSettingInput
            value={this.state.settings[ScoreType.nweaRead]} 
            onChange={this.createOnChange(ScoreType.nweaRead)}/>
        </div>
        <div id="projector-select-container projector-subj-math">
          <TransformerSettingInput
            value={this.state.settings[ScoreType.subjGradeMath]} 
            onChange={this.createOnChange(ScoreType.subjGradeMath)}/>
        </div>
        <div id="projector-select-container projector-subj-read"> 
          <TransformerSettingInput
            value={this.state.settings[ScoreType.subjGradeRead]} 
            onChange={this.createOnChange(ScoreType.subjGradeRead)}/>
        </div>
        <div id="projector-select-container projector-subj-science">
          <TransformerSettingInput 
            value={this.state.settings[ScoreType.subjGradeSci]} 
            onChange={this.createOnChange(ScoreType.subjGradeSci)}/>
        </div>
        <div id="projector-select-container projector-subj-socstudies">
          <TransformerSettingInput 
            value={this.state.settings[ScoreType.subjGradeSocStudies]} 
            onChange={this.createOnChange(ScoreType.subjGradeSocStudies)}/>
        </div>
      </div>
    )
  }
}; 

export default ScoreTransformer;
