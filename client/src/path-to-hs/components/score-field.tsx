import * as React from "react";

import Field from "shared/components/ui/field";

interface ScoreFieldProps {
  label: string
  defaultValue?: string
  editable: boolean
  validationFunction?: (string) => boolean
  onChange: (value: string) => any
}

interface ScoreFieldState {
  value: string
  label: string
  validationFunction: (string) => boolean
}

class ScoreField extends React.PureComponent<ScoreFieldProps, ScoreFieldState> {

  constructor(props) {
    super(props);
    this.state = {
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

    const field: React.ReactElement<HTMLInputElement> = (
      <input 
        value={this.state.value}
        onChange={this.handleScoreChange.bind(this)}
      />
    );

    return (
      <Field 
        field={field} 
        size="match-content" 
        label={this.state.label} >
      </Field>
    );
  }

};

export default ScoreField;
