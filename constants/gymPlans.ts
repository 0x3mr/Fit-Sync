export const ShipOptions: { [key: number]: string[] } = {
  5: ["Basic access", "Coach Followup", "Diet program", "Boxing access", "Live Coach Access", "24/7 support"],
  15: ["Basic access"],
  30: ["Basic access", "Diet program"],
  60: ["Basic access", "Coach Followup", "Diet program"],
  90: ["Basic access", "Coach Followup", "Diet program", "Boxing access", "Live Coach Access"],
  360: ["Basic access", "Coach Followup", "Diet program", "Boxing access", "Live Coach Access", "24/7 support"]
}

export const PlanBenfits = [
    "Basic access",
    "Coach Followup",
    "Diet program",
    "Boxing access",
    "Live Coach Access",
    "24/7 support",
];

export type PlanOptions = {
    [key: number]: string[];
};
