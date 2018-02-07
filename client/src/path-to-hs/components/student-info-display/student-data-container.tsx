import * as React from "react";

import { connect } from "react-redux";
import AppState from "shared/types/app-state";
import CPSProgram from "shared/types/cps-program";
import denormalize from "shared/util/denormalize";

import Box from "shared/components/layout/box";
import StudentDataForm from "./student-data-form";

import { fromJS } from "immutable";

import {
  updateStudentGender,
  updateStudentLocation, 
  updateStudentGradeLevel,
  updateStudentPrevGradeLevel,
  updateStudentCurrESProgram,
  updateStudentSiblingHSPrograms,
  updateStudentELLStatus,
  updateStudentIEPStatus,
  updateStudentAttendPercentage,

  updateStudentNWEAPercentileMath,
  updateStudentNWEAPercentileRead,
  updateStudentSubjGradeMath,
  updateStudentSubjGradeRead,
  updateStudentSubjGradeSci,
  updateStudentSubjGradeSocStudies,
} from "shared/actions";

const getHsPrograms = ( state: AppState ): CPSProgram[] => {
  // FIXME: this is rough
  return [];
}

const getEsPrograms = ( state: AppState ): CPSProgram[] => {
  return [];
};

const mapStateToProps = (state: AppState) => {
  return {

    gender: state.getIn(['studentData', 'gender']),
    location: state.getIn(['studentData', 'location']), // FIXME how to avoid both toJS here and immutableJS in dumb component?
    gradeLevel: state.getIn(['studentData', 'gradeLevel']),
    prevGradeLevel: state.getIn(['studentData', 'prevGradeLevel']),
    iep: state.getIn(['studentData', 'iep']),
    ell: state.getIn(['studentData', 'ell']),
    attendancePercentage: state.getIn(['studentData', 'attendancePercentage']),

    currESProgramID: state.getIn(['studentData', 'currESProgramID']),
    siblingHSProgramIDs: state.getIn(['studentData', 'siblingHSProgramIDs']),

    seTestPercentile: state.getIn(['studentData', 'seTestPercentile']),
    nweaPercentileMath: state.getIn(['studentData', 'nweaPercentileMath']),
    nweaPercentileRead: state.getIn(['studentData', 'nweaPercentileRead']),
    subjGradeMath: state.getIn(['studentData', 'subjGradeMath']),
    subjGradeRead: state.getIn(['studentData', 'subjGradeRead']),
    subjGradeSci: state.getIn(['studentData', 'subjGradeSci']),
    subjGradeSocStudies: state.getIn(['studentData', 'subjGradeSocStudies']),

    hsPrograms: getHsPrograms(state),
    esPrograms: getEsPrograms(state)
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onGenderChange: gender => dispatch(updateStudentGender(gender)),
    onLocationChange: location => dispatch(updateStudentGender(fromJS(location))),
    onGradeLevelChange: gradeLevel => dispatch(updateStudentGradeLevel(gradeLevel)),
    onPrevGradeLevelChange: gradeLevel => dispatch(updateStudentPrevGradeLevel(gradeLevel)),
    onCurrESProgramChange: programID => dispatch(updateStudentCurrESProgram(programID)),
    onSiblingHSProgramsChange: programIDs => dispatch(updateStudentSiblingHSPrograms(programIDs)),
    onELLChange: ellStatus => dispatch(updateStudentELLStatus(ellStatus)),
    onIEPChange: iepStatus => dispatch(updateStudentIEPStatus(iepStatus)),
    onAttendPercentageChange: attendPct => dispatch(updateStudentAttendPercentage(attendPct)),
    onNWEAPercentileMathChange: pctile => dispatch(updateStudentNWEAPercentileMath(pctile)),
    onNWEAPercentileReadChange: pctile => dispatch(updateStudentNWEAPercentileRead(pctile)),
    onSubjGradeMathChange: grade => dispatch(updateStudentSubjGradeMath(grade)),
    onSubjGradeReadChange: grade => dispatch(updateStudentSubjGradeRead(grade)),
    onSubjGradeSciChange: grade => dispatch(updateStudentSubjGradeSci(grade)),
    onSubjGradeSocStudiesChange: grade => dispatch(updateStudentSubjGradeSocStudies(grade))
  };
};

const StudentDataContainer = connect(mapStateToProps, mapDispatchToProps)(StudentDataForm);

export default StudentDataContainer;
