import * as React from "react";

interface ListBoxElemProps {
  value: string
  onSelect: (value: string) => any
  selected: boolean
}

const ListBoxElement: React.SFC<ListBoxElemProps> = (props) => {
  return (
    <li 
      className="list-box-element"
      onClick={ ev => {
        props.onSelect(props.value);
      }}
    >
      {props.children}
    </li>
  )
};

export default ListBoxElement;
