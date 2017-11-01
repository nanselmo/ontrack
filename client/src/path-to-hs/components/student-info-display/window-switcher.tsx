import * as React from "react";

import "./window-switcher.scss";

import ArrowUpIcon from "shared/components/icons/arrow-up";

enum Window {
  A = 0,
  B = 1
}

interface WindowSwitcherProps {
  windowA: React.ReactElement<any>
  windowB: React.ReactElement<any>
}

interface WindowSwitcherState {
    activeWindow: Window
}

class WindowSwitcher extends React.PureComponent<WindowSwitcherProps, WindowSwitcherState> {

    constructor(props) {
        super(props);
        this.state = {
            activeWindow: Window.A
        }
    }

    private switchActiveWindow = () => {
        if (this.state.activeWindow === Window.A) {
            this.setState({activeWindow: Window.B});
        } else {
            this.setState({activeWindow: Window.A});
        }
    }

    render() {
        return(
            <div className="window-switcher-container">
                <div className={`window-switcher ${this.state.activeWindow === Window.A ? "window-a-active" : "window-b-active"}`}>
                    <div className="window">
                        {this.props.windowA}
                    </div>
                    <button
                        className="window-switcher-button"
                        onClick={this.switchActiveWindow}>
                        <ArrowUpIcon
                            width="24px"
                            height="24px"/>
                    </button>
                    <div className="window">
                        {this.props.windowB}
                    </div>
                </div>
            </div>
        )
    }
};

export default WindowSwitcher;
