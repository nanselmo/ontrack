import StudentScores from "shared/types/student-scores";
import StudentData from "shared/types/student-data";
import HSData from "shared/types/hs-data";
import RequirementsFunction from "shared/types/requirements-function";

export const MOCK_STUDENT_SCORES: StudentScores = {
  nweaMath: 200,
  nweaRead: 201,
  subjGradeMath: 90,
  subjGradeRead: 80,
  subjGradeSci: 79,
  subjGradeSocStudies: 66 
}

export const MOCK_STUDENT_DATA: StudentData = {
  studentFirstName: "Testfella",
  studentLastName: "McGee",
  address: "761 W Altgeld",
  ell: true,
  iep: false,
  gradeLevel: 5,
  tier: "4",
  scores: MOCK_STUDENT_SCORES,
}

const standardAppReqFn: RequirementsFunction = (studentData) => {
  const percentileMath: number = studentData.scores.nweaPercentileMath;
  const percentileRead: number = studentData.scores.nweaPercentileRead;
  // if students are not English Learners and do not have an IEP
  // then their Math and Reading RIT percentiles must both be above 24th.
  if (!studentData.ell && !studentData.iep) {
    if (percentileMath > 24 && percentileRead > 24) {
      return true;
    }
  // if students are ELs or have IEP, then their Math and Reading RIT
  // percentiles combined must be above 48th.
  } else {
    if (percentileMath + percentileRead > 48) {
      return true;
    }
  }
  //
  return false;
};

const randomSelectionFn: RequirementsFunction = (studentData) => {
  return Math.random() > 0.5;
};

export const MOCK_HS_DATA: HSData = [
  {
    longName: "Selective Enrollment",
    shortName: "SE",
    additionalRequirements: [
      {
        name: "Kill him",
        value: null,
        validationFunction: (value) => true,
        decrementValueFunction: (value: string | null) => value ? value.slice(-1) : "",
        incrementValueFunction: (value: string | null) => value ? value += "_" : ""
      },
      {
        name: "Kill him now",
        value: null,
        validationFunction: (value) => true,
        decrementValueFunction: (value: string | null) => value ? value.slice(-1) : "",
        incrementValueFunction: (value: string | null) => value ? value += "_" : ""
      },
      {
        name: "Do it",
        value: null,
        validationFunction: (value) => true,
        decrementValueFunction: (value: string | null) => value ? value.slice(-1) : "",
        incrementValueFunction: (value: string | null) => value ? value += "_" : ""
      },

    ],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
      {
        longName: "Walter Peyton College Prep",
        shortName: "Peyton",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this.state this accurate
        selectionRequirementsFunction: randomSelectionFn,
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Hancock College Prep",
        shortName: "Hancock",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lane Tech",
        shortName: "Lane",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Walter Peyton College Prep 2",
        shortName: "Peyton2",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Hancock College Prep 2",
        shortName: "Hancock2",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // Hancock 2 is different
        selectionRequirementsFunction: (studentData: StudentData) => true, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lane Tech 2",
        shortName: "Lane2",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Walter Peyton College Prep 3",
        shortName: "Peyton3",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Hancock College Prep 3",
        shortName: "Hancock3",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lane Tech 3",
        shortName: "Lane3",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Walter Peyton College Prep 4",
        shortName: "Peyton4",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Hancock College Prep 4",
        shortName: "Hancock4",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lane Tech 4",
        shortName: "Lane5",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Walter Peyton College Prep 5",
        shortName: "Peyton6",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Hancock College Prep 5",
        shortName: "Hancock6",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lane Tech 5",
        shortName: "Lane6",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
    ],
  },
  {
    longName: "International Baccalaureate (IB)",
    shortName: "IB",
    additionalRequirements: [],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
      {
        longName: "William Howard Taft IB Program",
        shortName: "Taft IB",
        initials: "T",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Whitney M. Young IB Program",
        shortName: "Whitney Young",
        initials: "WY",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lindblom Math and Science Acaemy IB Program",
        shortName: "Lindblom",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
    ],
  },
  {
    longName: "Military Schools",
    shortName: "Military",
    additionalRequirements: [],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
      {
        longName: "Walter Peyton College Prep",
        shortName: "Peyton",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Hancock College Prep",
        shortName: "Hancock",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lane Tech",
        shortName: "Lane",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
    ],
  },
  {
    longName: "Magnet Programs",
    shortName: "Magnet",
    additionalRequirements: [],
    // coin flip
    requirementsFunction: (studentData: StudentData) => Math.random() > 0.5,
    highschools: [
      {
        longName: "William Howard Taft IB Program",
        shortName: "Taft IB",
        initials: "T",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Whitney M. Young IB Program",
        shortName: "Whitney Young",
        initials: "WY",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
      {
        longName: "Lindblom Math and Science Acaemy IB Program",
        shortName: "Lindblom",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: randomSelectionFn, 
        applicationRequirementsFunction: standardAppReqFn
      },
    ],
  },



];
