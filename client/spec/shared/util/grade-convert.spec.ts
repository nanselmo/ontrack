import {expect} from "chai";
import {scoreToPercentile,
  percentileToScore,
  scoreToString,
  GradeConvertErrors
} from "../../../src/shared/util/grade-convert";
import {
  ritToPercentile,
  percentileToRit,
  NWEATestType
} from "../../../src/shared/util/nwea-convert";
import ScoreType from "../../../src/shared/enums/score-type";

describe("scoreToPercentile", () => {
  it("should throw on unexpected ScoreType", () => {
    const scoreType = null as ScoreType;
    const gradeLevel = 5;
    const score = 50;
    expect(() => scoreToPercentile(score, scoreType, gradeLevel))
      .to.throw(GradeConvertErrors.BadScoreType);
  });

  it("should throw on NaN scores", () => {
    const scoreType = ScoreType.nweaMath;
    const gradeLevel = 5;
    const score = NaN;
    expect(() => scoreToPercentile(score, scoreType, gradeLevel))
      .to.throw();
  });

  // Behavior when passed numeric grade: map grades (range 0-100) 
  // onto percentiles (range 1-99) by the following rules: grade 50 
  // and below are percentile 1, grades  between 50 - 100 map linearly 
  // onto range 1-99.
  it("should accurately convert numeric grades - 1", () => {
    const scoreType = ScoreType.subjGradeMath;
    const gradeLevel = 5;
    const score = 50;
    expect(scoreToPercentile(score, scoreType, gradeLevel)).to.equal(1);
  });

  it("should accurately convert numeric grades - 2", () => {
    const scoreType = ScoreType.subjGradeRead;
    const gradeLevel = 8;
    const score = 0;
    expect(scoreToPercentile(score, scoreType, gradeLevel)).to.equal(1);
  });

  it("should accurately convert numeric grades - 3", () => {
    const scoreType = ScoreType.subjGradeSocStudies;
    const gradeLevel = 4;
    const score = 100;
    expect(scoreToPercentile(score, scoreType, gradeLevel)).to.equal(99);
  });

  it("should accurately convert numeric grades - 4", () => {
    const scoreType = ScoreType.subjGradeSocStudies;
    const gradeLevel = 7;
    const score = 75;
    expect(scoreToPercentile(score, scoreType, gradeLevel)).to.equal(50);
  });

  it("should accurately convert numeric grades - 5", () => {
    const scoreType = ScoreType.subjGradeSocStudies;
    const gradeLevel = 5;
    const score = 87.5;
    expect(scoreToPercentile(score, scoreType, gradeLevel)).to.equal(75);
  });

  // see spec for NWEAConvert; these tests assume that
  // NWEAConvert is working normally
  it("should accurately convert NWEA RIT scores - 1", () => {
    const scoreType = ScoreType.nweaMath;
    const gradeLevel = 5;
    const score = 276;
    expect(scoreToPercentile(score, scoreType, gradeLevel))
      .to.equal(ritToPercentile(score, NWEATestType.Math, gradeLevel));
  });

  it("should accurately convert NWEA RIT scores - 2", () => {
    const scoreType = ScoreType.nweaRead;
    const gradeLevel = 5;
    const score = 276;
    expect(scoreToPercentile(score, scoreType, gradeLevel))
      .to.equal(ritToPercentile(score, NWEATestType.Reading, gradeLevel));
  });
});

describe("percentileToScore", () => {
  it("should throw on unexpected ScoreType", () => {
    const scoreType = null as ScoreType;
    const gradeLevel = 5;
    const percentile = 50;
    expect(() => percentileToScore(percentile, scoreType, gradeLevel))
      .to.throw(GradeConvertErrors.BadScoreType);
  });

  it("should throw on NaN percentiles", () => {
    const scoreType = ScoreType.nweaMath;
    const gradeLevel = 5;
    const percentile = NaN;
    expect(() => percentileToScore(percentile, scoreType, gradeLevel))
      .to.throw();
  });

  it("should throw on unexpected percentiles", () => {
    const scoreType = ScoreType.nweaMath;
    const gradeLevel = 4;
    const percentile = 100;
    expect(() => percentileToScore(percentile, scoreType, gradeLevel))
      .to.throw(GradeConvertErrors.BadPercentile);
  });

  // Behavior when passed numeric grade: map grades (range 0-100) 
  // onto percentiles (range 1-99) by the following rules: grade 50 
  // and below are percentile 1, grades  between 50 - 100 map linearly 
  // onto range 1-99.
  it("should accurately convert numeric grades - 1", () => {
    const scoreType = ScoreType.subjGradeMath;
    const gradeLevel = 5;
    const percentile = 50;
    expect(percentileToScore(percentile, scoreType, gradeLevel)).to.be.closeTo(75, 1);
  });

  it("should accurately convert numeric grades - 2", () => {
    const scoreType = ScoreType.subjGradeRead;
    const gradeLevel = 8;
    const percentile = 1;
    expect(percentileToScore(percentile, scoreType, gradeLevel)).to.be.closeTo(50, 1);
  });

  it("should accurately convert numeric grades - 3", () => {
    const scoreType = ScoreType.subjGradeSocStudies;
    const gradeLevel = 4;
    const percentile = 99;
    expect(percentileToScore(percentile, scoreType, gradeLevel)).to.be.closeTo(100, 1);
  });

  it("should accurately convert numeric grades - 4", () => {
    const scoreType = ScoreType.subjGradeSocStudies;
    const gradeLevel = 7;
    const percentile = 75;
    expect(percentileToScore(percentile, scoreType, gradeLevel)).to.be.closeTo(87.5, 1);
  });

  // see spec for NWEAConvert; these tests assume that
  // NWEAConvert is working normally
  it("should accurately convert NWEA RIT scores - 1", () => {
    const scoreType = ScoreType.nweaMath;
    const gradeLevel = 5;
    const percentile = 23;
    expect(percentileToScore(percentile, scoreType, gradeLevel))
      .to.equal(percentileToRit(percentile, NWEATestType.Math, gradeLevel));
  });

  it("should accurately convert NWEA RIT scores - 2", () => {
    const scoreType = ScoreType.nweaRead;
    const gradeLevel = 5;
    const percentile = 78;
    expect(percentileToScore(percentile, scoreType, gradeLevel))
      .to.equal(percentileToRit(percentile, NWEATestType.Reading, gradeLevel));
  });

});

describe("scoreToString", () => {

  it("should convert A numeric grades to 'A'", () => {
    const score = 90;
    const scoreType = ScoreType.subjGradeMath;
    expect(scoreToString(score, scoreType)).to.equal("A");
  });

  it("should convert B numeric grades to 'B'", () => {
    const score = 80;
    const scoreType = ScoreType.subjGradeMath;
    expect(scoreToString(score, scoreType)).to.equal("B");
  });

  it("should convert C numeric grades to 'C'", () => {
    const score = 70;
    const scoreType = ScoreType.subjGradeMath;
    expect(scoreToString(score, scoreType)).to.equal("C");
  });

  it("should convert D numeric grades to 'D'", () => {
    const score = 60;
    const scoreType = ScoreType.subjGradeMath;
    expect(scoreToString(score, scoreType)).to.equal("D");
  });

  it("should convert F numeric grades to 'F'", () => {
    const score = 50;
    const scoreType = ScoreType.subjGradeMath;
    expect(scoreToString(score, scoreType)).to.equal("F");
  });

  it("should convert numeric grades of value 100 to correct letter grade", () => {
    const score = 100;
    const scoreType = ScoreType.subjGradeRead;
    expect(scoreToString(score, scoreType)).to.equal("A");
  });

  it("should convert numeric grades of value zero to correct letter grade", () => {
    const score = 0;
    const scoreType = ScoreType.subjGradeRead;
    expect(scoreToString(score, scoreType)).to.equal("F");
  });

  it("should convert rit scores to base10 string representation", () => {
    const score = 245;
    const scoreType = ScoreType.nweaMath;
    expect(scoreToString(score, scoreType)).to.equal("245");
  });

});
