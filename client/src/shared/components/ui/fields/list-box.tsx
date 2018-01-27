import * as React from "react";
import styled from "styled-components";

import ListBoxElement from "./list-box-element"

interface ListBoxProps<T> {
  className?: string
  visible: boolean
  searchString: string
  data: {records: T[], getKey: (record: T) => string, getDisplayText: (record: T) => string}
  selected: T | null
  onChange: (newValue: T | null) => any
}

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

  const ListBox: React.SFC<ListBoxProps<any>> = (props) => {

  return (
    <ul style={
      {
        height: "100px", 
        width: "100%", 
        overflowY: "auto", 
        visibility: props.visible ? "visible" : "hidden", 
        position: "absolute", 
          // todo we need to figure out a better way to position list elem in right place
        top: "20px", 
        left: 0,
        zIndex: 9,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }
    }>
    { props.data.records.map( opt => <ListBoxElementStyled
            key={props.data.getKey(opt)}
            className={props.className}
            value={ props.data.getKey(opt) } 
            selected={ props.selected === props.data.getKey(opt)}
            onSelect={ ev => props.selected === props.data.getKey(opt) ? props.onChange(null) 
                                                      : props.onChange(opt) }
          >
            {props.data.getDisplayText(opt)}
          </ListBoxElementStyled>
      ) }
    </ul>
  );
};

export default ListBox;
