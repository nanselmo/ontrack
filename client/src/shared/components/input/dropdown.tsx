import * as React from "react";

interface DropdownProps {
  label: string
  placeholder?: string
  values: {
    [key: string]: string
  }
  onChange: (state: DropdownState) => any
}

export interface DropdownState {
  options?: React.ReactElement<any>[]
  selected?: string
  hasPlaceholder?: boolean
  isClean?: boolean 
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {

  handleSelectUpdate(changeEvent: React.ChangeEvent<HTMLSelectElement>): void {
    let newState: any = {
      isClean: false,
      selected: changeEvent.currentTarget.value
    }
    if (this.state.hasPlaceholder) {
      newState.options = this.state.options.slice(1);
      newState.hasPlaceholder = false;
    }
    this.setState(newState);
    this.props.onChange(this.state);
  }

  constructor(props) {
    super(props);
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
    return (
      <div className="mui-select">
        <select onChange={this.handleSelectUpdate}>
          {this.state.options}
        </select>
        <label>
          {this.props.label}
        </label>
      </div>
    )
  }
}

