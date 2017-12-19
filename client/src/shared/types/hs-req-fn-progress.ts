// optional response that RequirementFunctions can give for schools
// which have a scoring element to passing requirement -- can be used
// to give feedback re how close student is to having a chance at succeeding (uncertain)
// being likely to succeed (likely) and being almost certain to succeed (certain)
interface Progress {
  value: number
  threshold_certain?: number
  threshold_likely?: number
  threshold_uncertain?: number
};

export default Progress;
