import * as React from "react";

import clone from "shared/util/clone";

import createScoreTransformerFunction from "./create-score-transformer-function";

import ScoreType from "shared/types/score-type";
import ScoreTransformerSettings from "shared/types/score-transformer-settings";

import TransformerSettingInput from "./transformer-setting-input";

interface ScTrInputProps {
  settings: ScoreTransformerSettings
  onChange: (ScoreTransformerSettings) => any;
}

const ScoreTransformerInputContainer = (props: ScTrInputProps) => {

  const createOnChange = (scoreType: ScoreType): (value: number) => any => {
    const handler = (value: number) => {
      console.log(props.settings[scoreType] === value);
      if (props.settings[scoreType] !== value) {
        const settings = clone(props.settings);
        settings[scoreType] = value;
        props.onChange(settings);
      }
    };
    return handler;
  }

  return (
    <div>
      <div id="projector-select-container projector-nwea-math">
        {console.log(props.settings)}
        <TransformerSettingInput 
          value={props.settings[ScoreType.nweaMath]}
          onChange={createOnChange(ScoreType.nweaMath)}/>
      </div>
    </div>
  )
}; 
/*
      <div id="projector-select-container projector-nwea-math">
        <TransformerSettingInput 
          value={props.settings[ScoreType.nweaMath]} 
          onChange={createOnChange(ScoreType.nweaMath)}/>
      </div>
      <div id="projector-select-container projector-nwea-read">
        <TransformerSettingInput
          value={props.settings[ScoreType.nweaRead]} 
          onChange={createOnChange(ScoreType.nweaRead)}/>
      </div>
      <div id="projector-select-container projector-subj-math">
        <TransformerSettingInput
          value={props.settings[ScoreType.subjGradeMath]} 
          onChange={createOnChange(ScoreType.subjGradeMath)}/>
      </div>
      <div id="projector-select-container projector-subj-read"> 
        <TransformerSettingInput
          value={props.settings[ScoreType.subjGradeRead]} 
          onChange={createOnChange(ScoreType.subjGradeRead)}/>
      </div>
      <div id="projector-select-container projector-subj-science">
        <TransformerSettingInput 
          value={props.settings[ScoreType.subjGradeSci]} 
          onChange={createOnChange(ScoreType.subjGradeSci)}/>
      </div>
      <div id="projector-select-container projector-subj-socstudies">
        <TransformerSettingInput 
          value={props.settings[ScoreType.subjGradeSocStudies]} 
          onChange={createOnChange(ScoreType.subjGradeSocStudies)}/>
      </div>

 */
export default ScoreTransformerInputContainer;
