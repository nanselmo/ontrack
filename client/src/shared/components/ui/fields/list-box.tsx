import * as React from "react";
import styled from "styled-components";

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
          // todo we need to figure out a better way to position list elem in right place
        top: "20px", 
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

export default ListBox;
