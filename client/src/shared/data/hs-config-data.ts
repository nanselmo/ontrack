import HSData from "shared/types/hs-data";
import HSRequirementFunction from "shared/types/hs-requirements-function";
import StudentData from "shared/types/student-data";
import {calculateSEPoints, calculateIBPoints} from "shared/util/hs-calc-utils";

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
  return (data, additionalRequirements): boolean => {
    // return true if student's scores are higher than midway between minimum score and average
    // NOTE: this is pretty arbitrary, but there's no good way of forecasting for sure whether or not
    // scores are good enough to get into a SE score in the future, as acceptances are based on
    // the top applicants each round.
    const score: number = calculateSEPoints(data, additionalRequirements);
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

export const HSConfigData: HSData = [
  {
    longName: "Selective Enrollment",
    shortName: "SE",
    additionalRequirements: [],
    requirementsFunction: standardApplicationRequirements,
    highschools: [
      {
        longName: "Gwendolyn Brooks College Preparatory Academy",
        shortName: "Brooks",
        initials: "B",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 834.15, min: 799,  max: 897},
          tier1: {avg: 700.76, min: 652,  max: 796},
          tier2: {avg: 740.36, min: 687,  max: 795},
          tier3: {avg: 768.40, min: 750,  max: 792},
          tier4: {avg: 761.50, min: 723,  max: 797},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "John Hancock College Preparatory High School",
        shortName: "Hancock",
        initials: "H",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 823.92, min: 794,  max: 880},
          tier1: {avg: 706.40, min: 664,  max: 791},
          tier2: {avg: 757.68, min: 736,  max: 790},
          tier3: {avg: 772.69, min: 753,  max: 791},
          tier4: {avg: 740.63, min: 672,  max: 792},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "William Jones College Preparatory High School",
        shortName: "Jones",
        initials: "J",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 893.81, min: 889,  max: 900},
          tier1: {avg: 816.86, min: 771,  max: 887},
          tier2: {avg: 851.57, min: 823,  max: 889},
          tier3: {avg: 874.12, min: 861,  max: 889},
          tier4: {avg: 886.69, min: 883,  max: 889},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "Dr Martin Luther King Jr College Prep",
        shortName: "King HS",
        initials: "MLK",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 735.59, min: 682,  max: 859},
          tier1: {avg: 632.20, min: 600,  max: 680},
          tier2: {avg: 635.16, min: 601,  max: 679},
          tier3: {avg: 645.55, min: 608,  max: 682},
          tier4: {avg: 634.43, min: 600,  max: 674},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "Albert G Lane Technical High School",
        shortName: "Lane Tech HS",
        initials: "LT",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 878.11, min: 866,  max: 900},
          tier1: {avg: 738.79, min: 692,  max: 863},
          tier2: {avg: 808.46, min: 777,  max: 865},
          tier3: {avg: 839.69, min: 818,  max: 866},
          tier4: {avg: 855.13, min: 843,  max: 865},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "Robert Lindblom Math & Science Academy",
        shortName: "Lindblom HS",
        initials: "L",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 813.87, min: 774,  max: 895},
          tier1: {avg: 692.14, min: 655,  max: 771},
          tier2: {avg: 732.82, min: 700,  max: 774},
          tier3: {avg: 743.98, min: 720,  max: 774},
          tier4: {avg: 717.92, min: 672,  max: 773},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "Northside College Preparatory High School",
        shortName: "Northside Prep HS",
        initials: "NP",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 898.85, min: 896,  max: 900},
          tier1: {avg: 820.31, min: 757,  max: 892},
          tier2: {avg: 867.55, min: 843,  max: 895},
          tier3: {avg: 889.04, min: 880,  max: 895},
          tier4: {avg: 893.92, min: 891,  max: 896},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "Walter Payton College Preparatory High School",
        shortName: "Payton HS",
        initials: "P",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 899.03, min: 898,  max: 900},
          tier1: {avg: 837.66, min: 771,  max: 897},
          tier2: {avg: 875.60, min: 846,  max: 897},
          tier3: {avg: 886.97, min: 875,  max: 898},
          tier4: {avg: 895.59, min: 894,  max: 898},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "South Shore Intl College Prep High School",
        shortName: "South Shore Intl HS",
        initials: "SS",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 725.28, min: 678,  max: 837},
          tier1: {avg: 621.10, min: 601,  max: 674},
          tier2: {avg: 637.17, min: 600,  max: 677},
          tier3: {avg: 632.43, min: 601,  max: 677},
          tier4: {avg: 634.77, min: 603,  max: 672},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "George Westinghouse College Prep",
        shortName: "Westinghouse HS",
        initials: "W",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 799.38, min: 766,  max: 883},
          tier1: {avg: 706.44, min: 667,  max: 760},
          tier2: {avg: 733.79, min: 708,  max: 765},
          tier3: {avg: 730.68, min: 695,  max: 765},
          tier4: {avg: 691.26, min: 618,  max: 766},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
      {
        longName: "Whitney M Young Magnet High School",
        shortName: "Young HS",
        initials: "Y",
        selectionRequirementsFunction: createSESelectionReqFn({
          rank: {avg: 890.34, min: 882,  max: 900},
          tier1: {avg: 823.25, min: 780,  max: 880},
          tier2: {avg: 846.26, min: 821,  max: 880},
          tier3: {avg: 860.88, min: 849,  max: 882},
          tier4: {avg: 877.46, min: 874,  max: 882},
        }),
        applicationRequirementsFunction: standardApplicationRequirements
      },
,
    ],
  },
  {
    longName: "International Baccalaureate (IB)",
    shortName: "IB",
    additionalRequirements: [],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
    ],
  },
  {
    longName: "Military Schools",
    shortName: "Military",
    additionalRequirements: [],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
    ],
  },
  {
    longName: "Magnet Programs",
    shortName: "Magnet",
    additionalRequirements: [],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
    ],
  }
];


