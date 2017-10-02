import StudentScores from "shared/types/student-scores";
import StudentData from "shared/types/student-data";
import HSData from "shared/types/hs-data";

export const MOCK_STUDENT_SCORES: StudentScores = {
  nweaMath: 150,
  nweaRead: 140,
  subjGradeMath: 90,
  subjGradeRead: 80,
  subjGradeSci: 79,
  subjGradeSocStudies: 66 
}

export const MOCK_STUDENT_DATA: StudentData = {
  address: "761 W Altgeld",
  ell: true,
  iep: false,
  gradeLevel: 6,
  tier: 4,
  scores: MOCK_STUDENT_SCORES,
}

export const MOCK_HS_DATA: HSData = [
  {
    longName: "Selective Enrollment",
    shortName: "SE",
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
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Hancock College Prep",
        shortName: "Hancock",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lane Tech",
        shortName: "Lane",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Walter Peyton College Prep 2",
        shortName: "Peyton2",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Hancock College Prep 2",
        shortName: "Hancock2",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // Hancock 2 is different
        selectionRequirementsFunction: (studentData: StudentData) => true 
      },
      {
        longName: "Lane Tech 2",
        shortName: "Lane2",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Walter Peyton College Prep 3",
        shortName: "Peyton3",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Hancock College Prep 3",
        shortName: "Hancock3",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lane Tech 3",
        shortName: "Lane3",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Walter Peyton College Prep 4",
        shortName: "Peyton4",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Hancock College Prep 4",
        shortName: "Hancock4",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lane Tech 4",
        shortName: "Lane5",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Walter Peyton College Prep 5",
        shortName: "Peyton6",
        initials: "WP",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Hancock College Prep 5",
        shortName: "Hancock6",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lane Tech 5",
        shortName: "Lane6",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
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
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Whitney M. Young IB Program",
        shortName: "Whitney Young",
        initials: "WY",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lindblom Math and Science Acaemy IB Program",
        shortName: "Lindblom",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
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
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Hancock College Prep",
        shortName: "Hancock",
        initials: "H",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lane Tech",
        shortName: "Lane",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
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
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Whitney M. Young IB Program",
        shortName: "Whitney Young",
        initials: "WY",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
      {
        longName: "Lindblom Math and Science Acaemy IB Program",
        shortName: "Lindblom",
        initials: "L",
        coordinates: {lat: "58.19981208", long: "66.823948"},
        // statistically this is accurate
        selectionRequirementsFunction: (studentData: StudentData) => false 
      },
    ],
  },



];
