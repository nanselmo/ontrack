import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";

import styled from "styled-components";

const INPUT_HEIGHT = "20px";

interface ListBoxElemProps {
  className: string
  value: string
  displayText: string
  onSelect: (value: string) => any
  selected: boolean
}

const ListBoxElement: React.SFC<ListBoxElemProps> = (props) => {
  return (
    <li 
      className={props.className}
      onClick={ ev => {
        props.onSelect(props.value);
      }}
    >
      {props.displayText}
    </li>
  )
};


interface ListBoxProps {
  className?: string
  visible: boolean
  searchString: string
  data: {value: string, text: string}[]
  selected: string | null
  onChange: (newValue: string | null) => any
}

const ListBox: React.SFC<ListBoxProps> = (props) => {

  const ListBoxElementStyled = styled(ListBoxElement)`
    cursor: default;
    text-decoration: none;
    margin-left: none;
    padding-left: none;

    padding: 0.25em;

    width: 100%;
    border-bottom: 1px dotted gray;
    background-color: white;
    transition: background-color 100ms ease;
    :hover {
      background-color: gray;
    }
    ${ props => {
        if (props.selected) {
          return `
            background-color: blue;
            color: white;
          `;
        } else {
          return "";
        }
      }
    }
  `;

  return (
    <ul style={
      {
        height: "100px", 
        width: "100%", 
        overflowY: "auto", 
        visibility: props.visible ? "visible" : "hidden", 
        position: "absolute", 
        top: INPUT_HEIGHT, 
        left: 0,
        zIndex: 9,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }
    }>
      {
      props.data.map( x => {
        return (
          <ListBoxElementStyled
            className={props.className}
            key={x.value} 
            value={x.value}
            displayText={x.text}
            selected={props.selected === x.value}
            onSelect={ ev => {
              props.selected === x.value ? props.onChange(null) 
                : props.onChange(x.value);
              }
            }
          />
         ) 
       })
       }
    </ul>
  );
};

interface CboProps extends FieldProps {
  data: {value: string, text: string}[]
}

interface CboState {
  searchString: string 
  listBoxVisible: boolean
}

class ComboBoxField extends React.PureComponent<CboProps, CboState> {

  private getDisplayText = (value: string): string => {

    if (value) {
      for (let i = 0; i < this.props.data.length; i++) {
        if (this.props.data[i].value === value) {
          return this.props.data[i].text;
        }
      }
    }

    return "not found";
  }

  constructor(props) {
    super(props);
    console.log("initialized: " + props.value);
    this.state = {
      listBoxVisible: false,
      searchString: this.getDisplayText(props.value)
    };
  }

  componentWillReceiveProps(newProps) {
    console.log("recieved: " + newProps.value);
    this.setState({searchString: this.getDisplayText(this.props.value)});
  }

  render() {
    const validation = this.props.validator ? this.props.validator(this.props.value) 
                                       : FieldValidationState.NEUTRAL;

    return (
      <FieldContainer className={this.props.className} label={this.props.label} validation={validation}>
        <div className="field-input-element" style={{position: "relative"}}>
          <input 
            onFocus={ () => this.setState({listBoxVisible: true}) } 
            style={{width: "100%", height: INPUT_HEIGHT}}
            type="text" 
            value={this.state.searchString}
            onChange={ ev => this.setState({searchString: ev.currentTarget.value}) }
          />
          <ListBox 
            visible={this.state.listBoxVisible} 
            data={this.props.data} 
            selected={this.props.value}
            searchString={this.state.searchString} 
            onChange={ (newValue) => {
              this.setState({
                listBoxVisible: false,
              });
              this.props.onChange(newValue)
            } }
            />
        </div>
      </FieldContainer>
    );
  }
};

export default ComboBoxField;

