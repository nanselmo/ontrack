import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";

import ListBox from "./list-box";
import ListOption from "./list-option";
import getDisplayText from "./get-display-text";
import getKey from "./get-key";

import styled from "styled-components";

interface CboProps<T> {
  value: T | null
  onChange: (newOpt: ListOption) => any
  data: {records: T[], getKey: (record: T) => string, getDisplayText: (recort: T) => string};

  label?: string
  placeholder?: string

  validator?: (nextOpt: T) => FieldValidationState
  restrictor?: (nextOpt: T) => boolean

  className?: string
}

interface CboState {
  searchString: string 
  listBoxVisible: boolean
}

class ComboBoxField extends React.PureComponent<CboProps<any>, CboState> {

  constructor(props) {
    super(props);
    this.state = {
      searchString: props.value ? getDisplayText(props.value) : " ",
      listBoxVisible: false
    }
  }

  render() {
    const validation = this.props.validator ? this.props.validator(this.props.value) 
                                       : FieldValidationState.NEUTRAL;

    return (
      <FieldContainer 
        className={this.props.className} 
        label={this.props.label} 
        validation={validation}
      >
      
        <div className="field-input-element" style={{position: "relative"}}>
          <input 
            onFocus={ () => this.setState({listBoxVisible: true}) } 
            style={{width: "100%", height: "20px"}}
            type="text" 
            value={this.state.searchString || " "}
            onChange={ ev => this.setState({searchString: ev.currentTarget.value}) }
          />
          <ListBox 
            visible={this.state.listBoxVisible} 
            data={this.props.data} 
            selected={this.props.value}
            searchString={this.state.searchString} 
            onChange={ (opt: any) => {
              this.setState({
                listBoxVisible: false,
                searchString: this.props.data.getDisplayText(opt)
              });
              this.props.onChange(opt)
            } }
            />
        </div>
      </FieldContainer>
    );
  }
};

export default ComboBoxField;

