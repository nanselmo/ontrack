import HSData from "shared/types/hs-data";
import HSRequirementFunction from "shared/types/hs-requirements-function";
import AdditionalRequirements from "shared/types/additional-requirements";
import StudentData from "shared/types/student-data";
import {calculateSEPoints, calculateIBPoints} from "shared/util/hs-calc-utils";

const noRequirement: HSRequirementFunction = (data) => true;

const lotterySelection: HSRequirementFunction = (data) => false;

// IMPLEMENT
// ---------
const magnetApplicationRequirement: HSRequirementFunction = (data) => true;
const magnetSelectionRequirement: HSRequirementFunction = (data) => false;

const militaryApplicationRequirement: HSRequirementFunction = (data) => true;
const militarySelectionRequirement: HSRequirementFunction = (data) => false;

const selectiveCTEApplicationRequirement: HSRequirementFunction = (data) => true;
const selectiveCTESelectionRequirement: HSRequirementFunction = (data) => true;

const implementMe: HSRequirementFunction = (data) => {
  console.warn("HS requirement function not implemented!");
  return false;
};
// ---------

const standardApplicationRequirements: HSRequirementFunction = (data): boolean => {
  const nweaMathPercentile = data.scores.nweaPercentileMath;
  const nweaReadPercentile = data.scores.nweaPercentileRead;
  if (!data.ell && !data.iep) {
    if (nweaMathPercentile > 24 && nweaReadPercentile > 24) {
      return true;
    }
  // if students are ELs or have IEP, then their Math and Reading RIT
  // percentiles combined must be above 48th.
  } else {
    if (nweaMathPercentile + nweaReadPercentile > 48) {
      return true;
    }
  }
  return false;
};

interface SECutoffScoreSet {
  min: number
  avg: number
  max: number
}

interface SECutoffScores {
  rank: SECutoffScoreSet
  tier1: SECutoffScoreSet
  tier2: SECutoffScoreSet
  tier3: SECutoffScoreSet
  tier4: SECutoffScoreSet
}

const createSESelectionReqFn = (cutoffScores: SECutoffScores): HSRequirementFunction => {

  return (data:StudentData, addlReqs: AdditionalRequirements): boolean => {


    // get SETestPercentile from additonal requirements
    let seTestPercentile: number;
    try{
      seTestPercentile = addlReqs["seTestPercentile"].inputValue;
    } catch(e) {
      // if lookup fails, return false
      //console.warn(e);
      return false;
    }
    // return true if student's scores are higher than midway between minimum score and average
    // NOTE: this is pretty arbitrary, but there's no good way of forecasting for sure whether or not
    // scores are good enough to get into a SE score in the future, as acceptances are based on
    // the top applicants each round, and so the score thresholds change each year.
    const score: number = calculateSEPoints(data, seTestPercentile);
    let studentTierCutoffs;
    switch(data.tier){
      case "1":
        studentTierCutoffs = cutoffScores.tier1;
        break;
      case "2":
        studentTierCutoffs = cutoffScores.tier2;
        break;
      case "3":
        studentTierCutoffs = cutoffScores.tier3;
        break;
      case "4":
        studentTierCutoffs = cutoffScores.tier4;
        break;
      default:
        throw new Error(`Unrecognized tier: ${data.tier}`);
    }
    return score >= studentTierCutoffs.avg - ((studentTierCutoffs.avg - studentTierCutoffs.min) / 2);
  };
};

const createIBSelectionReqFn = (cutoffScore: number): HSRequirementFunction => {
  return (data, additionalRequirements?) => {
    const score = calculateIBPoints(data);
    return score >= cutoffScore;
  }
};
