import * as React from "react";
import { connect } from "react-redux";

import AppState from "shared/types/app-state";

import Box from "shared/components/layout/box";
import HSProgramType from "./hs-program-type";
import HSProgramSuccessChanceKey from "./hs-program-success-chance-key";

const mapStateToProps = (state: AppState) => {

}

const HSDisplay: React.SFC<any> = (props) => {

  return (
    <Box width="half" height="full" responsiveBehavior={{mobile: "fullscreen"}}>
      <HSProgramSuccessChanceKey/>
      <div style={{width: "100%", height: "100%", overflowY: "auto", overflowX:"hidden"}}>
        { Object.keys(props.hsData).map( (programType: string) => <HSProgramType
                                                                    programType={programType}
                                                                    programs={props.hsData[programType]}
                                                                    studentData={props.studentData}
                                                                    key={programType}
                                                                  /> ) }
      </div>
    </Box>
  )

};

export default HSDisplay;
