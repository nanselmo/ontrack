import {expect} from "chai";
import {NWEATestingSession, 
  NWEATestType, 
  NWEAConvertErrors,
  percentileToRit,
  ritToPercentile} from "../../../src/shared/util/nwea-convert";

/**
 * NOTE
 * These tests is based on the NWEA 2015 norms. If new norms are released,
 * replace norm data in shared/data/rit-percentile-lookup.ts and update
 * these tests.
 */

describe("percentileToRit", () => {
  it("should throw on NaN grade", () => {
    const percentile = 50;
    const testType = NWEATestType.Math;
    const gradeLevel = NaN;
    expect(() => percentileToRit(percentile, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadGradeLevel);
  });

  it("should throw on number grade outside of expected range", () => {
    const percentile = 50;
    const testType = NWEATestType.Math;
    const gradeLevel = 13;
    expect(() => percentileToRit(percentile, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadGradeLevel);
  });

  it("should throw on NaN percentile", () => {
    const percentile = NaN;
    const testType = NWEATestType.Math;
    const gradeLevel = 5;
    expect(() => percentileToRit(percentile, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadPercentile);
  });

  it("should throw on percentile outside of expected range", () => {
    const percentile = 100;
    const testType = NWEATestType.Math;
    const gradeLevel = 5;
    expect(() => percentileToRit(percentile, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadPercentile);
  });

  it("should give correct rit score for inputs - 1", () => {
    const percentile = 79;
    const testType = NWEATestType.Reading;
    const gradeLevel = 7;
    const expectedRit = 230;
    expect(percentileToRit(percentile, testType, gradeLevel)).to.equal(expectedRit);
  });

  it("should give correct rit score for inputs - 2", () => {
    const percentile = 18;
    const testType = NWEATestType.Math;
    const gradeLevel = 5;
    const expectedRit = 207;
    expect(percentileToRit(percentile, testType, gradeLevel)).to.equal(expectedRit);
  });

  it("should give correct rit score for inputs - 3", () => {
    const percentile = 40;
    const testType = NWEATestType.Reading;
    const gradeLevel = 8;
    const expectedRit = 216;
    expect(percentileToRit(percentile, testType, gradeLevel)).to.equal(expectedRit);
  });

});

describe("ritToPercentile", () => {
  it("should throw on NaN grade", () => {
    const rit = 250;
    const testType = NWEATestType.Math;
    const gradeLevel = NaN;
    expect(() => ritToPercentile(rit, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadGradeLevel);
  });

  it("should throw on number grade outside of expected range", () => {
    const rit = 250;
    const testType = NWEATestType.Math;
    const gradeLevel = 13;
    expect(() => ritToPercentile(rit, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadGradeLevel);
  });

  it("should throw on NaN rit", () => {
    const rit = NaN;
    const testType = NWEATestType.Math;
    const gradeLevel = 5;
    expect(() => ritToPercentile(rit, testType, gradeLevel))
      .to.Throw(NWEAConvertErrors.BadRitScore);
  });

  it("should give correct percentile for very low rit scores", () => {
    const rit = 125;
    const testType = NWEATestType.Reading;
    const gradeLevel = 5;
    const expectedPercentile = 1;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

  it("should give correct percentile for very high rit scores", () => {
    const rit = 300; 
    const testType = NWEATestType.Reading;
    const gradeLevel = 7;
    const expectedPercentile = 99;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

  it("should give correct percentile for inputs - 1", () => {
    const rit = 201;
    const testType = NWEATestType.Reading;
    const gradeLevel = 7;
    const expectedPercentile = 13;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

  it("should give correct percentile for inputs - 2", () => {
    const rit = 185;
    const testType = NWEATestType.Math;
    const gradeLevel = 5;
    const expectedPercentile = 1;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

  it("should give correct percentile for inputs - 3", () => {
    const rit = 238;
    const testType = NWEATestType.Reading;
    const gradeLevel = 8;
    const expectedPercentile = 87;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

  it("should give correct percentile for inputs - 4", () => {
    const rit = 256;
    const testType = NWEATestType.Reading;
    const gradeLevel = 7;
    const expectedPercentile = 99;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

  it("should give correct percentile for inputs - 4", () => {
    const rit = 218;
    const testType = NWEATestType.Math;
    const gradeLevel = 7;
    const expectedPercentile = 27;
    expect(ritToPercentile(rit, testType, gradeLevel)).to.equal(expectedPercentile);
  });

});
