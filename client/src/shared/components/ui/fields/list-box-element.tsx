import * as React from "react";

interface ListBoxElemProps {
  value: string
  onSelect: (ev: React.SyntheticEvent<HTMLLIElement>) => any
  selected: boolean
}

const ListBoxElement: React.SFC<ListBoxElemProps> = (props) => {
  return (
    <li 
      className="list-box-element"
      onMouseDown={ ev => {
        // FIXME: a little hacky
        // prevent blurring parent form
        ev.stopPropagation();
        props.onSelect(ev);
      }}
    >
      {props.children}
    </li>
  )
};

export default ListBoxElement;
