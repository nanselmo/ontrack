import * as React from "react";

import ListBoxElement from "./list-box-element"

interface ListBoxProps<T> {
  className?: string
  visible: boolean
  searchString: string
  data: {records: T[], getKey: (record: T) => string, getDisplayText: (record: T) => string}
  selected: T | null
  onChange: (newValue: T | null) => any
}

const ListBox: React.SFC<ListBoxProps<any>> = (props) => {

  const className = "list-box " + (props.visible ? "visible" : "");

  return (
    <ul className={className}>
    { props.data.records.map( opt => <ListBoxElement
            key={props.data.getKey(opt)}
            value={ props.data.getKey(opt) } 
            selected={ props.selected === props.data.getKey(opt)}
            onSelect={ ev => {
              props.selected === props.data.getKey(opt) ? props.onChange(null) 
                                                        : props.onChange(opt) 
            } }
          >
            {props.data.getDisplayText(opt)}
          </ListBoxElement>
      ) }
    </ul>
  );
};

export default ListBox;
