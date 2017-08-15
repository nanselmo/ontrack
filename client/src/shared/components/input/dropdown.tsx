import * as React from "react";

interface props {
  label: string
  values: {
    [key: string]: string
  }
}

const Dropdown: React.SFC<props> = (props) => {

  const options = [];
  for (let key in props.values) {
    options.push([key, props.values[key]]);
  }

  return (
    <div>
      <span>{props.label}</span>
      <select>
        {options.map( ([key, value]) => {
          return <option key={key}>{value}</option>
        })}
      </select>
    </div>
  )

};

export default Dropdown;
