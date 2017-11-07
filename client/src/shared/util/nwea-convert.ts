import {MathPercentileRitLookup, ReadPercentileRitLookup} from "shared/data/percentile-rit-lookup";

export enum NWEATestingSession {
  Spring = "Spring",
  Winter = "Winter",
  Fall = "Fall"
};

export enum NWEATestType {
  Math = "Mathematics",
  Reading = "Reading"
};

export const NWEAConvertErrors = {
  BadPercentile: new Error("Percentile not in 1-99"),
  BadGradeLevel: new Error("Grade level not in 2-8"),
  BadRitScore: new Error("Rit score is NaN or negative"),
  BadTestType: new Error("Unknown test type"),
  TestingSessionNotImplemented: new Error("No records for this testing session."),
  PercentileLookupError: new Error("RIT score matching percentile not found.")
};

export const percentileToRit = (percentile: number, 
      testType: NWEATestType, 
      gradeLevel: number,
      testSession: NWEATestingSession = NWEATestingSession.Spring): number => {

  if (!(percentile >= 1 && percentile <= 99)) {
    throw NWEAConvertErrors.BadPercentile;
  }
  if (!(gradeLevel >= 2 && gradeLevel <= 8)) {
    throw NWEAConvertErrors.BadGradeLevel;
  }
  if (testType !== NWEATestType.Math && testType !== NWEATestType.Reading) {
    throw NWEAConvertErrors.BadTestType;
  }
  if (testSession !== NWEATestingSession.Spring) {
    throw NWEAConvertErrors.TestingSessionNotImplemented;
  }
  switch(testType) {
    case NWEATestType.Math: 
        return findRit(MathPercentileRitLookup[gradeLevel], percentile);
    case NWEATestType.Reading: 
        return findRit(ReadPercentileRitLookup[gradeLevel], percentile);
  }
};

export const ritToPercentile = (rit: number, 
      testType: NWEATestType, 
      gradeLevel: number,
      testSession: NWEATestingSession = NWEATestingSession.Spring): number => {

  if (!(gradeLevel >= 2 && gradeLevel <= 8)) {
    throw NWEAConvertErrors.BadGradeLevel;
  }
  if (testType !== NWEATestType.Math && testType !== NWEATestType.Reading) {
    throw NWEAConvertErrors.BadTestType;
  }
  if (testSession !== NWEATestingSession.Spring) {
    throw NWEAConvertErrors.TestingSessionNotImplemented;
  }
  if (!(rit > 0)) {
    throw NWEAConvertErrors.BadRitScore;
  }

  switch(testType) {
    case NWEATestType.Math: 
      return findPercentile(MathPercentileRitLookup[gradeLevel], rit);
    case NWEATestType.Reading: 
      return findPercentile(ReadPercentileRitLookup[gradeLevel], rit);
  }
};

const findPercentile = (ritByPercentile: number[], targetRit: number): number => {
  // percentileArray is sorted; search for percentile such that 
  // ritScore is <= percentile and > percentile - 1.
  for (let i = 0; i < ritByPercentile.length; i++) {
    const currRit = ritByPercentile[i];
    const nextRit = ritByPercentile[i + 1];
    const percentile = i + 1;
    // on first iteration (percentile 1),
    // return current percentile if rit is less than nextRit
    if (i === 0) {
      if (targetRit < nextRit) {
        return percentile;
      }
    // on last iteration, nextRit is undefined
    // and percentile = 99. So, if targetRit is greater than
    // currRit, targetRit is in 99th percentile.
    } else if (i === ritByPercentile.length - 1) {
      if (targetRit >= currRit) {
        return percentile;
      }
    // on all other iterations (percentiles 1 - 98),
    // return current percentile if targetRit lies
    // between it and the next percentile.
    // Sometimes, two adjacent percentiles have the same
    // rit score; in those cases, return the lowest percentile.
    } else {
      if (targetRit === currRit && targetRit === nextRit) {
        return percentile;
      } else if (targetRit >= currRit && targetRit < nextRit) {
        return percentile;
      }
    }
  }
};

const findRit = (percentileArray: number[], percentile: number): number => {
  const index = percentile - 1;
  const rit = percentileArray[index];
  if (rit === undefined) {
    throw NWEAConvertErrors.PercentileLookupError;
  } else {
    return rit;
  }
};
