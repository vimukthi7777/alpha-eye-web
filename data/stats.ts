import type { Stat } from "./types";

export const statsHeading = "Numbers that speak for themselves";

// DUMMY values – replace with real numbers.
export const stats: Stat[] = [
  { id: "projects", label: "Projects Completed", value: 120, suffix: "+" },
  { id: "clients", label: "Happy Clients", value: 45, suffix: "+" },
  { id: "years", label: "Years of Experience", value: 6, suffix: "+" },
  { id: "satisfaction", label: "Client Satisfaction", value: 98, suffix: "%" },
];
