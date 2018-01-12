import * as React from "react";

import CPSProgram from "shared/types/cps-program";

import "./hs-program-info-card.scss";

interface HSInfoCardProps {
  program: CPSProgram 
  visible: boolean
  boundingRect: ClientRect
}

interface HSInfoCardState {
  xOffset: number
  yOffset: number
}

class HSProgramInfoCard extends React.PureComponent<HSInfoCardProps, HSInfoCardState> {
  constructor(props) {
    super(props);
    this.state = {
      xOffset: 0,
      yOffset: 0
    };
  }

  private calculateOffset = (rect: ClientRect, boundingRect: ClientRect): [number, number] =>  {
    // FIXME: bug -- if iframe CANNOT fit in bounding box, then it will continuously try to
    // adjust itself due to calls to setState.
    // calculate the number of pixels needed to offset the 'elem' element 
    // so that it does not overflow the bounds of the bounding ClientRect passed to it
    if (!rect || !boundingRect) {
      return [0,0];
    }
    let xOffset = 0;
    let yOffset = 0;
    // DEBUG
    console.log(rect);
    console.log(boundingRect);
    // END DEBUG
    if (rect.left < boundingRect.left) {
      xOffset = 0;
    } else {
      xOffset = rect.left - boundingRect.left;
    }
    if (rect.top < boundingRect.top) {
      yOffset = 0;
    } else {
      yOffset = rect.top - boundingRect.top;
    }
    return [xOffset, yOffset];
  }

  private selfRef: HTMLDivElement;

  componentWillReceiveProps(nextProps) {
    // TODO -- we know how big the iframe is going to be -- no point
    // doing all this fancy stuff with a ref here. I'm signing you off
    // for a break before you do any more damage.
    if (nextProps.visible) {
      console.log(this.selfRef);
      const elemRect = this.selfRef ? this.selfRef.getBoundingClientRect() : null;
      const [xOffset, yOffset] = this.calculateOffset(elemRect, nextProps.boundingRect);
      console.log(xOffset, yOffset);
      //this.setState({
      //  xOffset,
      //  yOffset
      //});
    }
  }

  render() {
    if (this.props.visible) {
      return (<div 
        ref={(elem) => (this.selfRef = elem)}
        style={{top: this.state.xOffset, left: this.state.yOffset}}
        className="hs-info-card visible">
        <iframe 
          className="hs-info-card-preview"
          src={this.props.program.CPS_School_Profile}>
        </iframe>
      </div>)
    } else {
      return <div className="hs-info-card hidden"></div>;
    }
  }
};

export default HSProgramInfoCard;
