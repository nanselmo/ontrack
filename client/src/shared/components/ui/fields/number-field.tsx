import * as React from "react";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import Limiter from "./limiter";

// TODO remove dependency
import debounce from "shared/util/debounce";

interface NumberFieldProps {
  onChange: (newValue: number) => any
  value: number | null

  label?: string
  placeholder?: string

  validator?: (nextValue: number) => FieldValidationState
  limiter?: Limiter<number>

  debounceTime?: number

  className?: string
  style?: React.StyleHTMLAttributes<HTMLInputElement>
}

interface NumberFieldState {
  localValue: number | ""
}

class NumberField extends React.PureComponent<NumberFieldProps, NumberFieldState> {

  constructor(props) {
    super(props);
    this.state = {
      localValue: props.value ? props.value : ""
    }
    this.onChange = props.debounceTime ? debounce(props.onChange, props.debounceTime) : props.onChange
  }

  private onChange: Function;

  componentWillReceiveProps(nextProps) {
    if (this.state.localValue !== "") {
      this.setState({localValue: nextProps.value ? nextProps.value : ""});
    }
    this.onChange = nextProps.debounceTime ? debounce(nextProps.onChange, nextProps.debounceTime) : nextProps.onChange
  }

  render() {
    const handleChange = (ev): boolean => {
      // special case: if input is blank, show
      // blank input but do not pass value up to parent
      if (ev.currentTarget.value === "") {
        this.setState({localValue: ""});
        return false;
      } else {
        const currValue = this.props.value;
        const nextValue = ev.currentTarget.valueAsNumber;
        this.setState({localValue: nextValue});
        if (this.props.limiter) {
          this.onChange(this.props.limiter(currValue, nextValue));
        } else {
          this.onChange(nextValue);
        }
        return true;
      }
    };

    const validation = this.props.validator && this.state.localValue !== "" ? this.props.validator(this.state.localValue) 
                                       : FieldValidationState.NEUTRAL;

    return (
      <FieldContainer className={this.props.className} label={this.props.label} validation={validation}>
        <input value={this.state.localValue} type="number" className="field-input-element" onChange={handleChange}/>
      </FieldContainer>
    );
  }
};

export default NumberField;

