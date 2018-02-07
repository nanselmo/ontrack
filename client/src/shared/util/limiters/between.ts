import Limiter from "shared/types/limiter";

const between = (min: number, max: number): Limiter<number> => {
  return (curr: number, next: number): number => {
    if (Number.isNaN(next)) {
      return curr;
    } else if (next < min) {
      return min;
    } else if (next > max) {
      return max; 
    } else {
      return next;
    }
  };
};

export default between;
