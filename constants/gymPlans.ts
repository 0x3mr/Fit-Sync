export const ShipOptions: { [key: number]: string[] } = {
  5: ["Basic access", "Diet program", "24/7 support"],
  15: ["Basic access"],
  30: ["Basic access", "Diet program"],
  60: ["Basic access", "Diet program"], //20%
  90: ["Basic access", "Diet program", "24/7 support"],
  360: ["Basic access", "Diet program", "24/7 support"] //35%
}

export const PlanBenfits = [
    "Basic access",
    "Diet program",
    "24/7 support",
];

export type PlanOptions = {
    [key: number]: string[];
};
