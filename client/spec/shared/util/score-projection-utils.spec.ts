import {expect} from "chai";

import StudentData from "../../../src/shared/types/student-data";
import {cloneAndExtend} from "../../../src/shared/util/clone";

import {
  projectScores,
  projectStudentData,
  getAveragePercentileDifference
} from "../../../src/shared/util/score-projection-utils";

const basicStudentData: StudentData = {
    studentFirstName: "Michael",
    studentLastName: "Ingram",
    address: "5001 Bird Ln",
    tier: "2",
    ell: false,
    iep: false,
    gradeLevel: 5,
    scores: {}
};

describe("projectStudentData", () => {

  it("should return new studentdata with correctly adjusted gradelevel", () => {
    const currGradeLevel = 5;
    const targetGradeLevel = 7;
    const inputStuentData = cloneAndExtend(basicStudentData, {
      gradeLevel: 5,
      scores: {
        nweaMath: 210,
        nweaRead: 228,
        subjGradeSci: 80,
        subjGradeMath: 50,
        subjGradeRead: 52,
        subjGradeSocStudies: 30,
      }
    });
    const output = projectStudentData({
      studentData: inputStuentData, 
      targetGradeLevel: targetGradeLevel,
      percentileChange: 0
    });
    expect(output.gradeLevel).to.equal(targetGradeLevel);
  });

  it("should return accurate nweaRead percentile when moving across grade levels with no percentile change", () => {
    const currGradeLevel = 5;
    const targetGradeLevel = 7;
    const inputStuentData = cloneAndExtend(basicStudentData, {
      gradeLevel: 5,
      scores: {
        nweaMath: 210,
        nweaRead: 228,
        subjGradeSci: 80,
        subjGradeMath: 50,
        subjGradeRead: 52,
        subjGradeSocStudies: 30,
      }
    });
    const output = projectStudentData({
      studentData: inputStuentData, 
      targetGradeLevel: targetGradeLevel,
      percentileChange: 0
    });

    const expectedNweaMathScore = 216;
    expect(output.scores.nweaMath).to.equal(expectedNweaMathScore);
  });

  it("should return accurate nweaRead percentile when moving across grade levels with no percentile change", () => {
    const currGradeLevel = 5;
    const targetGradeLevel = 7;
    const inputStuentData = cloneAndExtend(basicStudentData, {
      gradeLevel: 5,
      scores: {
        nweaMath: 210,
        nweaRead: 228,
        subjGradeSci: 80,
        subjGradeMath: 50,
        subjGradeRead: 52,
        subjGradeSocStudies: 30,
      }
    });
    const output = projectStudentData({
      studentData: inputStuentData, 
      targetGradeLevel: targetGradeLevel,
      percentileChange: 0
    });

    const expectedNweaReadScore = 235;
    expect(output.scores.nweaRead).to.equal(expectedNweaReadScore);
  });

  it("should return same subjectGrades when moving across grade levels with no percentile change", () => {
    const currGradeLevel = 5;
    const targetGradeLevel = 7;
    const inputStuentData = cloneAndExtend(basicStudentData, {
      gradeLevel: 5,
      scores: {
        nweaMath: 210,
        nweaRead: 228,
        subjGradeSci: 80,
        subjGradeMath: 50,
        subjGradeRead: 52,
        subjGradeSocStudies: 30,
      }
    });
    const output = projectStudentData({
      studentData: inputStuentData, 
      targetGradeLevel: targetGradeLevel,
      percentileChange: 0
    });

    const subjGradesEqual = 
      output.scores.subjGradeMath === inputStuentData.scores.subjGradeMath &&
      output.scores.subjGradeRead === inputStuentData.scores.subjGradeRead &&
      output.scores.subjGradeSci === inputStuentData.scores.subjGradeSci &&
      output.scores.subjGradeSocStudies === inputStuentData.scores.subjGradeSocStudies;

    expect(subjGradesEqual).to.be.true;
  });

  it("should accurately move nweaRead percentiles when changing percentiles", () => {
    const currGradeLevel = 5;
    const targetGradeLevel = 7;
    const inputStuentData = cloneAndExtend(basicStudentData, {
      gradeLevel: 5,
      scores: {
        nweaMath: 210,
        nweaRead: 228,
        subjGradeSci: 80,
        subjGradeMath: 50,
        subjGradeRead: 52,
        subjGradeSocStudies: 30,
      }
    });
    const output = projectStudentData({
      studentData: inputStuentData, 
      targetGradeLevel: targetGradeLevel,
      percentileChange: 10 
    });

    const expectedNweaReadScore = 245;
    expect(output.scores.nweaRead).to.equal(expectedNweaReadScore);
  });

  it("should accurately move nweaMath percentiles when changing percentiles", () => {
    const currGradeLevel = 5;
    const targetGradeLevel = 7;
    const inputStuentData = cloneAndExtend(basicStudentData, {
      gradeLevel: 5,
      scores: {
        nweaMath: 210,
        nweaRead: 228,
        subjGradeSci: 80,
        subjGradeMath: 50,
        subjGradeRead: 52,
        subjGradeSocStudies: 30,
      }
    });
    const output = projectStudentData({
      studentData: inputStuentData, 
      targetGradeLevel: targetGradeLevel,
      percentileChange: -8 
    });

    const expectedNweaMathScore = 211;
    expect(output.scores.nweaMath).to.equal(expectedNweaMathScore);
  });

});

describe("getAveragePercentileDifference", () => {


});
