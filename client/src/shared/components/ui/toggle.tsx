import * as React from "React";

interface ToggleProps {
  onChange: (value: boolean) => any
  displayValues: {on: string, off: string}
}

interface ToggleState {
  value: boolean
}

class Toggle extends React.PureComponent<ToggleProps, ToggleState> {

  constructor(props){
    super(props);
    this.state = {
      value: false
    }
  }

  private handleClick(event) {
    const newValue: boolean = ! this.state.value;
    this.setState({
      value: newValue
    });
  }

  render() {
    let className: string = "toggle ";
    if (this.state.value) {
      className += "toggle-on";
    } else {

    }
    return (
      <div className="toggle">

      </div>
    )
  }

};

export default Toggle;
