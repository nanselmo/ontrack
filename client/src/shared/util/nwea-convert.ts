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
  BadGradeLevel: new Error("Grade level not in 2-8"),
  TestingSessionNotImplemented: new Error("No records for this testing session."),
  PercentileLookupError: new Error("RIT score matching percentile not found.")
};

const findPercentile = (ritByPercentile: number[], targetRit: number): number => {
  // percentileArray is sorted; search for percentile such that 
  // ritScore is <= percentile and > percentile - 1.
  for (let i = 0; i < ritByPercentile.length; i++) {
    const currRit = ritByPercentile[i];
    const nextRit = ritByPercentile[i + 1];
    const percentile = i + 1;
    // on last iteration, nextRit is undefined
    // and percentile = 99. So, if targetRit is greater than
    // currRit, targetRit is in 99th percentile.
    if (i === ritByPercentile.length - 1) {
      if (targetRit < nextRit) {
        return percentile;
      }
    // on all other iterations (percentiles 1 - 98),
    // return current percentile if targetRit lies
    // between it and the previous percentile.
    } else {
      if (targetRit >= currRit && targetRit < nextRit) {
        return percentile;
      }
    }
  }
};

const findRit = (percentileArray: number[], percentile: number): number => {
  const rit = percentileArray[percentile];
  if (rit === undefined) {
    throw NWEAConvertErrors.PercentileLookupError;
  } else {
    return rit;
  }
};


export const percentileToRit = (percentile: number, 
      testType: NWEATestType, 
      gradeLevel: number,
      testSession: NWEATestingSession = NWEATestingSession.Spring): number => {

  if (gradeLevel < 2 || gradeLevel > 8) {
    throw NWEAConvertErrors.BadGradeLevel;
  }
  if (testSession !== NWEATestingSession.Spring) {
    throw NWEAConvertErrors.TestingSessionNotImplemented;
  }
  switch(testType) {
    case NWEATestType.Math: 
      switch(gradeLevel) {
        case 2:
          return findRit(MathPercentileRitLookup["Grade_2"], percentile);
        case 3:
          return findRit(MathPercentileRitLookup["Grade_3"], percentile); 
        case 4:
          return findRit(MathPercentileRitLookup["Grade_4"], percentile); 
        case 5:
          return findRit(MathPercentileRitLookup["Grade_5"], percentile); 
        case 6:
          return findRit(MathPercentileRitLookup["Grade_6"], percentile); 
        case 7:
          return findRit(MathPercentileRitLookup["Grade_7"], percentile); 
        case 8:
          return findRit(MathPercentileRitLookup["Grade_8"], percentile); 
      }
    case NWEATestType.Reading: 
      switch(gradeLevel) {
        case 2:
          return findRit(ReadPercentileRitLookup["Grade_2"], percentile);
        case 3:
          return findRit(ReadPercentileRitLookup["Grade_3"], percentile); 
        case 4:
          return findRit(ReadPercentileRitLookup["Grade_4"], percentile); 
        case 5:
          return findRit(ReadPercentileRitLookup["Grade_5"], percentile); 
        case 6:
          return findRit(ReadPercentileRitLookup["Grade_6"], percentile); 
        case 7:
          return findRit(ReadPercentileRitLookup["Grade_7"], percentile); 
        case 8:
          return findRit(ReadPercentileRitLookup["Grade_8"], percentile); 
      }
  }
};

export const ritToPercentile = (rit: number, 
      testType: NWEATestType, 
      gradeLevel: number,
      testSession: NWEATestingSession = NWEATestingSession.Spring): number => {

  if (gradeLevel < 2 || gradeLevel > 8) {
    throw NWEAConvertErrors.BadGradeLevel;
  }
  if (testSession !== NWEATestingSession.Spring) {
    throw NWEAConvertErrors.TestingSessionNotImplemented;
  }

  switch(testType) {
    case NWEATestType.Math: 
      switch(gradeLevel) {
        case 2:
          return findPercentile(MathPercentileRitLookup["Grade_2"], rit);
        case 3:
          return findPercentile(MathPercentileRitLookup["Grade_3"], rit); 
        case 4:
          return findPercentile(MathPercentileRitLookup["Grade_4"], rit); 
        case 5:
          return findPercentile(MathPercentileRitLookup["Grade_5"], rit); 
        case 6:
          return findPercentile(MathPercentileRitLookup["Grade_6"], rit); 
        case 7:
          return findPercentile(MathPercentileRitLookup["Grade_7"], rit); 
        case 8:
          return findPercentile(MathPercentileRitLookup["Grade_8"], rit); 
      }
    case NWEATestType.Reading: 
      switch(gradeLevel) {
        case 2:
          return findPercentile(ReadPercentileRitLookup["Grade_2"], rit);
        case 3:
          return findPercentile(ReadPercentileRitLookup["Grade_3"], rit); 
        case 4:
          return findPercentile(ReadPercentileRitLookup["Grade_4"], rit); 
        case 5:
          return findPercentile(ReadPercentileRitLookup["Grade_5"], rit); 
        case 6:
          return findPercentile(ReadPercentileRitLookup["Grade_6"], rit); 
        case 7:
          return findPercentile(ReadPercentileRitLookup["Grade_7"], rit); 
        case 8:
          return findPercentile(ReadPercentileRitLookup["Grade_8"], rit); 
      }
  }
};


