import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";
import ListBox from "./list-box";

import styled from "styled-components";

interface CboProps extends FieldProps {
  data: {value: string, text: string}[]
}

interface CboState {
  searchString: string 
  listBoxVisible: boolean
}

// this is rul bad
// hm
// ok let's see... 
// let's make some simplifying assumptions, and then complexify
// the situation later if we need to. Let's say the combobox has props:
// -- data (/ options): string[] 
// -- value (/ selected): string
// -- onChange: string
//
// Then, internally, combobox allows typing any intermediate value into
// the hmmmmmmmmmmmmmmmmmmmmmmmmmmm ok major usability concern I didn't
// even realize: we don't want a combobox. We want a searchable dropdown.
// The user shouldn't think that they can type any name in. Ok, so change
// the UX -- and see if the ARIA spec has anything to say about it.
//
// Writing our own form field components is taking some time. Is it worth it?
// It's taking some guaranteed amount of time in exhange for the uncertainty
// of introducing more shitty dependencies and having to work with them. You've
// tried some very well-respected widget libraries (material, bootstrap and react-
// widgets) and disliked all of them so much that you ended up removing them.
// I don't think that there's going to be a magical drop-in solution for this
// problem.
// Plus, you stand to gain from this, as in stand to gain experience developing
// components that are reusable. (Which is hard and you need practice at.)
// So make up for the fact that it's taking you longer by working at it over
// the weekend. On Monday it would be best if all of the hard prooblems were solved
// and all that was left was easy problems -- you're going to be running around 
// with tech issues all day.

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

  render() {
    const validation = this.props.validator ? this.props.validator(this.props.value) 
                                       : FieldValidationState.NEUTRAL;

    return (
      <FieldContainer className={this.props.className} label={this.props.label} validation={validation}>
        <div className="field-input-element" style={{position: "relative"}}>
          <input 
            onFocus={ () => this.setState({listBoxVisible: true}) } 
            style={{width: "100%", height: "20px"}}
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
                searchString: this.getDisplayText(newValue)
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

