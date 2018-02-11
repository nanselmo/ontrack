import * as React from "react";

import FieldValidationState from "./field-validation-state";
import ListData from "./list-data";

import FieldContainer from "./field-container";
import ComboBoxField from "./combo-box-field";

import debounce from "shared/util/debounce";

interface MultiSelectProps<T> {
  values: T[] | null
  onChange: (newValues: T[] ) => any
  data: ListData<T>

  label?: string
  placeholder?: string

  validator?: (nextOpt: T) => FieldValidationState
  restrictor?: (nextOpt: T) => boolean

  debounceTime?: number

  className?: string
}

const MultiSelectField: React.SFC<MultiSelectProps<any>> = (props) => {


  const createOnChangeHandler = (index: number): (newValue: any) => void => {
    return (newValue: any) => {
      // replace props.values with new value at index
      const leftHalf = props.values.slice(0, index);
      const rightHalf = props.values.slice(index);
      const newValues = leftHalf.concat(newValue, rightHalf);
      props.onChange(newValues);
    };
  };

  const removeFromListData:(<T>(data: ListData<T>, elementsToRemove: T[]) => ListData<T>) = (data, elementsToRemove) => {
    const keysToRemove = elementsToRemove ? elementsToRemove.map(data.getKey) : [];
    const isNotElementToRemove = elem => keysToRemove.indexOf(data.getKey(elem)) === -1;
    const newRecords = data.records.filter( isNotElementToRemove );
    return {
      records: newRecords,
      getDisplayText: data.getDisplayText,
      getKey: data.getKey,
    };
  };

  const data = removeFromListData(props.data, props.values);

  const removeElemAtIndex = (arr: any[], i: number): any[] => {
    if (arr.length === 0) {
      return [];
    }  else if (arr.length === 1) {
      return [];
    } else {
      return arr.slice(0, i).concat(arr.slice(i));
    }
  };

  return (
    <FieldContainer
      label={props.label}
      validation={FieldValidationState.NEUTRAL}
    >
      { props.values && props.values.map( (value, i) => {
        return (
          <div 
            key={props.data.getKey(value)}
            style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center"}}>
            <ComboBoxField 
              value={value}
              onChange={createOnChangeHandler(i)}
              data={data}
              debounceTime={props.debounceTime}
            />
            <button 
              style={{width: "32px", height: "32px", backgroundColor: "#dfdfdf", border: "1px solid #acacac", borderRadius: "100%", margin: "0 1em", boxShadow: "0px 2px 2px #999" }} 
              onClick={() => { 
                props.onChange(removeElemAtIndex(props.values, i))
              }
              }>
              X
            </button>
          </div>
        );
      }) } 

      {/* new input field */}
      <ComboBoxField
        value={null}
        onChange={ newValue => {
          const newValues = props.values ? props.values.concat(newValue)
                                         : [newValue];
          props.onChange(newValues);
        } }
        data={data}
        debounceTime={props.debounceTime}
      />
    </FieldContainer>
  );

};

export default MultiSelectField;
