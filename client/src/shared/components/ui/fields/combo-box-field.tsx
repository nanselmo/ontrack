import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";

import styled from "styled-components";


const ListBox: React.SFC<any> = (props) => {
  return (
    <ul>
      <li></li>
    </ul>
  );
};


interface CboState {
  searchString: string 
  listBoxOpen: boolean
}

class ComboBoxField extends React.PureComponent<FieldProps, CboState> {

  constructor(props) {
    super(props);
    this.state = {
      listBoxOpen: false,
      searchString: props.value
    };
  }

  // essentially the problem: the <select> element expects <option value="">text here</option>.
  // But ARIA spec uses <li>value</li> for cbobox. Which hmm why?
  // Can we use React's key? let's see

  render() {
    const validation = this.props.validator ? this.props.validator(this.props.value) 
                                       : FieldValidationState.NEUTRAL;

    return (
      <FieldContainer className={this.props.className} label={this.props.label} validation={validation}>
        <div className="field-input-element">
          <input type="text" value={this.state.searchString}/>
          <ListBox visible={this.state.listBoxOpen} options={unpack(this.props.children)} searchString={this.state.searchString} onChange={() => console.log("Implement me!")}/>
        </div>
      </FieldContainer>
    );
  }
};

export default ComboBoxField;

