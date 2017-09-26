import * as React from "react";

import Field from "shared/components/ui/field";

import "./score-field.scss";;

interface ScoreFieldProps {
  label: string
  defaultValue?: string
  editable: boolean
  size: "sm" | "lg"
  validationFunction?: (string) => boolean
  onChange: (value: string) => any
}

interface ScoreFieldState {
  size: "sm" | "lg"
  editable: boolean
  value: string
  label: string
  validationFunction: (string) => boolean
}

class ScoreField extends React.PureComponent<ScoreFieldProps, ScoreFieldState> {

  constructor(props) {
    super(props);
    this.state = {
      size: props.size,
      editable: props.editable,
      value: props.defaultValue ? props.defaultValue : "",
      label: props.label,
      validationFunction: props.validationFunction
    }
  }

  private handleScoreChange(event: React.FormEvent<HTMLInputElement>): void {
    const value: string = event.currentTarget.value;
    this.setState({
      value: value
    });
    // TODO: get validation code in here, debounced similarly to the API call code
  }

  render() {

    return (
      <div className={`score-field ${this.state.size}`}>
        <div className={'score-field-label'}>
          {this.state.label}
        </div>
        <input
          className={`score-field-input ${this.state.size} ${this.state.editable ? "enabled" : ""}`}
          value={this.state.value}
          onChange={this.handleScoreChange.bind(this)}
        />
      </div>
    );
  }

};

export default ScoreField;
