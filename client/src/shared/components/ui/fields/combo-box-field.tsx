import * as React from "react";
import FieldProps from "./field-props";
import FieldValidationState from "./field-validation-state";
import FieldContainer from "./field-container";
import createFieldChangeHandler from "./create-field-change-handler";

import ListBox from "./list-box";
import ListOption from "./list-option";
import getDisplayText from "./get-display-text";
import getKey from "./get-key";

interface ListData<T> {
  records: T[]
  getKey: (record: T) => string
  getDisplayText: (recort: T) => string
}

interface CboProps<T> {
  value: T | null
  onChange: (newOpt: ListOption) => any
  data: ListData<T>

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
      searchString: props.value ? getDisplayText(props.value) : "",
      listBoxVisible: false
    }
  }

  private filter = (data: ListData<any>, filterString: string) => {

    const filteredRecords = data.records.filter( x => {
      const displayText = data.getDisplayText(x);
      const re = new RegExp(filterString, "i");
      const containsSearchString = re.test(displayText);
      return containsSearchString;
    });

    return {
      records: filteredRecords,
      getKey: data.getKey,
      getDisplayText: data.getDisplayText,
    };
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
      
      <div 
        className="field-input-element" 
        style={{position: "relative"}}
        >
          <input 
            style={{width: "100%", height: "20px"}}
            type="text" 
            value={this.state.searchString}
            onChange={ ev => this.setState({searchString: ev.currentTarget.value}) }
            onFocus={ () => {
              this.setState({listBoxVisible: true});
            } } 
            onBlur={ () => {
              this.setState({listBoxVisible: false});
            } }
          />
          <ListBox 
            visible={this.state.listBoxVisible} 
            data={this.filter(this.props.data, this.state.searchString)} 
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

