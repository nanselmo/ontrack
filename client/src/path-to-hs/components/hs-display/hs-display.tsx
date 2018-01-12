import * as React from "react";

import StudentData from "shared/types/student-data";
import CPSPrograms from "shared/types/cps-programs";
import CPSProgram from "shared/types/cps-program";

import Box from "shared/components/layout/box";
import HSProgramType from "./hs-program-type";

interface HSDisplayProps {
  studentData: StudentData
  hsData: CPSPrograms
};

interface HSDisplayState {
  boundingRect: ClientRect
};

class HSDisplay extends React.PureComponent<HSDisplayProps, HSDisplayState> {

  constructor(props) {
    super(props);
    this.state = {
      boundingRect: null
    }
  }

  private ref: HTMLDivElement;

  componentDidMount() {
    console.log(this.ref.getBoundingClientRect());
    this.setState({
      boundingRect: this.ref.getBoundingClientRect()
    });
  }

  render() {
    return (
      <Box 
        width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
        <div 
          ref={elem => (this.ref = elem)} 
          style={{width: "100%", height: "100%", overflowY: "auto"}}>
          { Object.keys(this.props.hsData).map( (programType: string) => {
          return <HSProgramType
            hsDisplayBoundingRect={this.state.boundingRect}
            programType={programType}
            programs={this.props.hsData[programType]}
            studentData={this.props.studentData}
            key={programType}/>
          }) }
        </div>
      </Box>
    )
  }
};

export default HSDisplay;
