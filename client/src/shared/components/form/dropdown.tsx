import * as React from "react";

import Field from "shared/components/form/field";

import "./dropdown.scss";


interface DropdownProps {
  label: string
  placeholder?: string
  size: "sm" | "md" | "lg" 
  values: {
    [key: string]: string
  }
  onChange: (newValue: string) => any
}

interface DropdownState {
  options?: React.ReactElement<any>[]
  selected?: string
  hasPlaceholder?: boolean
  isClean?: boolean 
}

export default class Dropdown extends React.Component<DropdownProps, DropdownState> {

  private sizeClassName: string = "";

  private handleSelectUpdate(changeEvent: React.ChangeEvent<HTMLSelectElement>): void {
    let newState: any = {
      isClean: false,
      selected: changeEvent.currentTarget.value
    }
    if (this.state.hasPlaceholder) {
      newState.options = this.state.options.slice(1)
      console.log(newState.options);
      newState.hasPlaceholder = false;
    }
    this.setState(newState);
    this.props.onChange(this.state.selected);
  }

  constructor(props) {
    super(props);

    if (props.size) {
      this.sizeClassName = "dropdown-" + props.size;
    }

    let options: React.ReactElement<any>[] = [];

    const createOption = (value, display): React.ReactElement<any> => {
      return <option key={value}>{display}</option>;
    };
    for (let value in props.values) {
      const display = props.values[value];
      options.push(createOption(value, display)); 
    }

    let hasPlaceholder: boolean = false;
    if (props.placeholder) {
      hasPlaceholder = true;
      const placeholder = createOption("placeholder", props.placeholder);
      options.unshift(placeholder);
    }

    this.state = {
      options: options,
      selected: "placeholder",
      hasPlaceholder: hasPlaceholder,
      isClean: true
    }
  }

  render() {
    const dropdown = (
      <select className={"dropdown" + this.sizeClassName} onChange={this.handleSelectUpdate.bind(this)}>
        {this.state.options}
      </select>
    );

    return (
      <Field label={this.props.label} field={dropdown}/>
    )
  }
}

