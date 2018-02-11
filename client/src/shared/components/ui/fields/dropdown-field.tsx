import * as React from "react";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";

import debounce from "shared/util/debounce";

interface DropdownFieldProps {
  value: string
  onChange: (newValue: string) => any

  label?: string
  placeholder?: string

  validator?: (nextVal: string) => FieldValidationState
  restrictor?: (nextVal: string) => boolean

  debounceTime?: number

  className?: string
}

interface DropdownFieldState {
  localValue: string
}

class DropdownField extends React.PureComponent<DropdownFieldProps, DropdownFieldState> {

  constructor(props) {
    super(props);
    this.state = {
      localValue: props.value ? props.value : ""
    }
    this.onChange = props.debounceTime ? debounce(props.onChange, props.debounceTime) : props.onChange
  }

  componentWillReceiveProps(nextProps) {
    this.setState({localValue: nextProps.value});
    this.onChange = nextProps.debounceTime ? debounce(nextProps.onChange, nextProps.debounceTime) : nextProps.onChange
  }

  private onChange: Function;

  render() {
    const validation = this.props.validator ? this.props.validator(this.state.localValue) 
                                       : FieldValidationState.NEUTRAL;

    const handleChange = (ev): void => {
      const newValue = ev.currentTarget.value;
      const shouldUpdate = this.props.restrictor ? this.props.restrictor(newValue)
                                             : true;

      if (shouldUpdate) {
        this.onChange(newValue);
      }
    };

    return (
      <FieldContainer className={this.props.className} label={this.props.label} validation={validation}>
        <select className="field-input-element" onChange={handleChange}>
          {this.props.children}
        </select>
      </FieldContainer>
    );
  }
}

export default DropdownField;
