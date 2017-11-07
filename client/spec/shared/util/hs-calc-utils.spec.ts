import {expect} from "chai";

import StudentData from "../../../src/shared/types/student-data";
import {cloneAndExtend} from "../../../src/shared/util/clone";

import {calculateSEPoints, calculateIBPoints} from "../../../src/shared/util/hs-calc-utils";

const basicStudentData: StudentData = {
    studentFirstName: "Michael",
    studentLastName: "Ingram",
    address: "5001 Bird Ln",
    tier: "2",
    ell: false,
    iep: false,
    gradeLevel: 7,
    scores: {}
};

describe("calculateSEPoints", () => {


  it("should return accurate SE scores according to rubric", () => {
    const inputStudentData = cloneAndExtend(basicStudentData, {
      scores: {
        nweaMath: 218,
        nweaRead: 256,
        subjGradeMath: 76,
        subjGradeRead: 87,
        subjGradeSci: 90,
        subjGradeSocStudies: 88
      }
    });
    const inputAddlReqs = {
      SETestPercentile: 75,
    };
    const expectedSEScore = 618; 

    expect(calculateSEPoints(inputStudentData, inputAddlReqs)).to.equal(expectedSEScore);
  });

  it("should never return SE scores higher than 900", () => {
    const inputStudentData = cloneAndExtend(basicStudentData, {
      scores: {
        nweaMath: 300,
        nweaRead: 300,
        subjGradeMath: 100,
        subjGradeRead: 100,
        subjGradeSci: 100,
        subjGradeSocStudies:100 
      }
    });
    const inputAddlReqs = {
      SETestPercentile: 99,
    };
    expect(calculateSEPoints(inputStudentData, inputAddlReqs)).to.not.be.greaterThan(901);
  });

});

describe("calculateIBPoints", () => {

  it("should return accurate IB scores according to rubric", () => {
    const inputStudentData = cloneAndExtend(basicStudentData, {
      scores: {
        nweaMath: 218,
        nweaRead: 256,
        subjGradeMath: 76,
        subjGradeRead: 87,
        subjGradeSci: 90,
        subjGradeSocStudies: 88
      }
    });

    const expectedIBScore = 586.5; 

    expect(calculateIBPoints(inputStudentData)).to.equal(expectedIBScore);
  });

  it("should never return IB scores higher than 950", () => {
    const inputStudentData = cloneAndExtend(basicStudentData, {
      scores: {
        nweaMath: 300,
        nweaRead: 300,
        subjGradeMath: 100,
        subjGradeRead: 100,
        subjGradeSci: 100,
        subjGradeSocStudies:100 
      }
    });
    const inputAddlReqs = {
      SETestPercentile: 99,
    };
    expect(calculateSEPoints(inputStudentData, inputAddlReqs)).to.not.be.greaterThan(950);
  });

});
