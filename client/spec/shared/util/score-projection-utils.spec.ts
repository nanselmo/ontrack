import {expect} from "chai";

import StudentData from "../../../src/shared/types/student-data";
import StudentScores from "../../../src/shared/types/student-scores";
import {clone, cloneAndExtend} from "../../../src/shared/util/clone";

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

  it("should return a percentile difference of 0 when passed two identical StudentScores", () => {
    const scoresA: StudentScores = {
      nweaMath: 210,
      nweaRead: 230,
      subjGradeMath: 73,
      subjGradeRead: 48,
      subjGradeSci: 100,
      subjGradeSocStudies: 22,
    };
    const gradeLevelA = 5;
    const scoresB = clone(scoresA);
    const gradeLevelB = 5;
    const expectedPercentileChange = 0;

    expect(getAveragePercentileDifference(scoresA, gradeLevelA, scoresB, gradeLevelB)).to.equal(expectedPercentileChange);
  });

  it("should return a percentile difference of 0 when passed two StudentScores from different grade levels with all percentiles of scores equal", () => {
    const gradeLevelA = 5;
    const scoresA: StudentScores = {
      nweaMath: 210, // 24th %ile for 5th gr Math
      nweaRead: 230, // 89th %ile for 5th gr Read
      subjGradeMath: 73,
      subjGradeRead: 48,
      subjGradeSci: 100,
      subjGradeSocStudies: 22
    };
    const gradeLevelB = 7;
    const scoresB = {
      nweaMath: 216, // 24th %ile for 7th grade Math
      nweaRead: 237, // 89th %ile for 7th grade Read
      subjGradeMath: 73,
      subjGradeRead: 48,
      subjGradeSci: 100,
      subjGradeSocStudies: 22,
    };
    const expectedPercentileChange = 0;

    expect(getAveragePercentileDifference(scoresA, gradeLevelA, scoresB, gradeLevelB)).to.equal(expectedPercentileChange);
  });

  it("should return the same number when all scores change by the same percentile", () => {
    const gradeLevelA = 5;
    const scoresA: StudentScores = {
      nweaMath: 210, // 24th %ile for 5th gr Math
      nweaRead: 230, // 89th %ile for 5th gr Read
      subjGradeMath: 73,
      subjGradeRead: 48,
      subjGradeSci: 100,
      subjGradeSocStudies: 22,
    };
    const gradeLevelB = 7;
    const scoresB = {
      nweaMath: 206, // 10th %ile for 7th gr math
      nweaRead: 228, // 75th %ile for 7th gr Read
      subjGradeMath: 73 - 14,
      subjGradeRead: 48 - 14,
      subjGradeSci: 100 - 14,
      subjGradeSocStudies: 22 - 14,
    };
    const expectedPercentileChange = -14;

    expect(getAveragePercentileDifference(scoresA, gradeLevelA, scoresB, gradeLevelB)).to.equal(expectedPercentileChange);
  });

  it("should return the average of the percentile changes of each score when scores are in same gradeLevel", () => {
    const gradeLevelA = 5;
    const scoresA: StudentScores = {
      nweaMath: 210, // 24th %ile for 5th gr Math
      nweaRead: 230, // 89th %ile for 5th gr Read
      subjGradeMath: 73,
      subjGradeRead: 48,
      subjGradeSci: 100,
      subjGradeSocStudies: 22,
    };
    const gradeLevelB = 5;
    const scoresB = {
      nweaMath: 211, // 26th (24 + 2) %ile for 5th gr Math
      nweaRead: 0, // 93rd (89 + 4) %ile for 5th gr Read
      subjGradeMath: 73 + 6,
      subjGradeRead: 48 + 8,
      subjGradeSci: 100,
      subjGradeSocStudies: 22 + 10,
    };
    const expectedPercentileChange = (2 + 4 + 6 + 8 + 0 + 10) / 6;
    expect(getAveragePercentileDifference(scoresA, gradeLevelA, scoresB, gradeLevelB)).to.equal(expectedPercentileChange);

  });

  it("should return the average of the percentile changes of each score when scores are in different gradeLevels", () => {
    const gradeLevelA = 7;
    const scoresA: StudentScores = {
      nweaMath: 220,
      nweaRead: 240,
      subjGradeMath: 73,
      subjGradeRead: 48,
      subjGradeSci: 100,
      subjGradeSocStudies: 22,
    };
    const gradeLevelB = 5;
    const scoresB = {
      nweaMath: 0/* TODO: look up -2 %ile change 7th-5th gr */,
      nweaRead: 0/* TODO: look up -4 %ile change 7th-5th gr*/,
      subjGradeMath: 73 - 6,
      subjGradeRead: 48 - 8,
      subjGradeSci: 100 - 10,
      subjGradeSocStudies: 22 - 12,
    };
    const expectedPercentileChange =  - ((2 + 4 + 6 + 8 + 10 + 12) / 6);
    expect(getAveragePercentileDifference(scoresA, gradeLevelA, scoresB, gradeLevelB)).to.equal(expectedPercentileChange);
  });
});
