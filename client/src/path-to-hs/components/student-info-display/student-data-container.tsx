import * as React from "react";

import { connect } from "react-redux";
import AppState from "shared/types/app-state";

import Box from "shared/components/layout/box";
import StudentDataForm from "./student-data-form";
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


const mapStateToProps = (state: AppState) => {
  return {studentData: state.studentData}
};

const mapDispatchToProps = dispatch => {
  return {
    onGenderChange: gender => dispatch(updateStudentGender(gender)),
    onLocationChange: location => dispatch(updateStudentGender(location)),
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
