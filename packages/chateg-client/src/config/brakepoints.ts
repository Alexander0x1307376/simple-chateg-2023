export type BrakePoints = "xs" | "sm" | "md" | "lg" | "xl";

const brakepoints: Readonly<Record<BrakePoints, string>> = {
  xs: "576px",
  sm: "768px",
  md: "992px",
  lg: "1200px",
  xl: "1600px",
};

export default brakepoints;
