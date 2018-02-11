import * as React from "react";

import HSProgram from "shared/types/hs-program";
import SuccessChance from "shared/enums/success-chance";

import HSProgramInfoCard from "./hs-program-info-card";

interface HSProgramElemProps {
  program: HSProgram
  selected: boolean
  onSelect: (id: string) => any
}

interface HSProgramElemState {
  showHSPreview: boolean
  pxFromTop: number
}

import "./hs-program-element.scss";

class HSProgramElement extends React.PureComponent<HSProgramElemProps, HSProgramElemState> {

  constructor(props) {
    super(props);
    this.state = { 
      showHSPreview: props.selected,
      pxFromTop: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showHSPreview: nextProps.selected
    });
  }

  render() {
    const className = "hs-list-element-icon " + 
      (this.state.showHSPreview ? "focus " : "") + 
      this.outcomeToClassName(
        this.getCombinedSuccessChance(this.props.program.applicationOutcome, this.props.program.selectionOutcome)
      )

    return (
      <div 
        className="hs-list-element"
        ref={ ref => {
          if (ref) { 
            this.setState({pxFromTop: ref.offsetTop + 50 });
          }
        } }
      >
        <button 
          className={className}
          onClick={() => this.props.onSelect(this.props.program.id)}
        />
        <div className="hs-list-element-shortname">
          {this.props.program.shortname}
        </div>
        <HSProgramInfoCard 
          visible={this.state.showHSPreview} 
          program={this.props.program}
          style={{top: this.state.pxFromTop}}
        />
      </div>
    )
  }

  private getCombinedSuccessChance = (application: SuccessChance, selection: SuccessChance) => {
    if (application === SuccessChance.CERTAIN || application === SuccessChance.LIKELY) {
      return selection;
    } else {
      return application;
    }
  }

  private outcomeToClassName = (outcome: SuccessChance) => {
    switch(outcome){
      case SuccessChance.CERTAIN:
        return "succ-certain"
      case SuccessChance.LIKELY:
        return "succ-likely"
      case SuccessChance.UNCERTAIN:
        return "succ-uncertain"
      case SuccessChance.UNLIKELY:
        return "succ-unlikely"
      case SuccessChance.NONE:
        return "succ-none"
      case SuccessChance.NOTIMPLEMENTED:
        return "succ-not-implemented"
      default:
        return "succ-not-implemented"
    }
  }
}

export default HSProgramElement;
