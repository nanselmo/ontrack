import * as React from "react";

interface ListBoxElemProps {
  className: string
  value: string
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
      {props.children}
    </li>
  )
};

export default ListBoxElement;
