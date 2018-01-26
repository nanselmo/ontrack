import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";

import styled from "styled-components";


interface ListBoxProps {
  visible: boolean
  searchString: string
  data: {value: string, text: string}[]
  selected: string | null
  onChange: (newValue: string | null) => any
}

const ListBox: React.SFC<ListBoxProps> = (props) => {

  const selectedStyle = {
    borderBottom: "1px dotted gray",
    background: "gray",
    color: "red",
  };

  const unselectedStyle = {
    borderBottom: "1px dotted gray",
  };

  return (
    <ul style={{height: "100px", width: "100%", overflowY: "auto"}}>
      {props.data.map( x => {
        return (
        <li 
          key={x.value} 
          style={ props.selected === x.value ? selectedStyle : unselectedStyle }
          onClick={ ev => props.selected === x.value ? props.onChange(null) 
                                                  : props.onChange(x.value) }
        >{x.text}</li>
       ) 
      }) }
    </ul>
  );
};

interface CboProps extends FieldProps {
  data: {value: string, text: string}[]
}

interface CboState {
  searchString: string 
  listBoxOpen: boolean
}

class ComboBoxField extends React.PureComponent<CboProps, CboState> {

  constructor(props) {
    super(props);
    this.state = {
      listBoxOpen: false,
      searchString: props.value
    };
  }

  render() {
    const validation = this.props.validator ? this.props.validator(this.props.value) 
                                       : FieldValidationState.NEUTRAL;

    return (
      <FieldContainer className={this.props.className} label={this.props.label} validation={validation}>
        <div className="field-input-element">
          <input type="text" value={this.state.searchString}/>
          <ListBox 
            visible={this.state.listBoxOpen} 
            data={this.props.data} 
            selected={this.props.value}
            searchString={this.state.searchString} 
            onChange={(newValue) => this.props.onChange(newValue)}/>
        </div>
      </FieldContainer>
    );
  }
};

export default ComboBoxField;

