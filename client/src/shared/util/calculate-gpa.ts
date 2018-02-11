import {toGPA} from "shared/util/grade-convert";

const calculateGPA = (...grades: number[]): number => {
  return toGPA([...grades]);
};

export default calculateGPA;
