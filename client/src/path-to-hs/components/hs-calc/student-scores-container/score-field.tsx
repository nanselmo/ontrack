import * as React from "react";

import Field from "shared/components/ui/field";

import "./score-field.scss";;

interface ScoreFieldProps {
  label: string
  value: string
  editable: boolean
  size: "sm" | "lg"
  validationFunction?: (string) => boolean
  onChange: (value: string) => any
}

const ScoreField = (props: ScoreFieldProps) => {

  const handleScoreChange = (event: React.FormEvent<HTMLInputElement>) => {
    props.onChange(event.currentTarget.value);
  };

  return (
    <div className={`score-field ${props.size}`}>
      <div className={'score-field-label'}>
        {props.label}
      </div>
      <input
        className={`score-field-input ${props.size} ${props.editable ? "enabled" : ""}`}
        value={props.value ? props.value : " "}
        onChange={handleScoreChange}
      />
    </div>
  );

};

export default ScoreField;
