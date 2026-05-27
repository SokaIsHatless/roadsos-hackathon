export type EmergencyNumber = {
  number: string;
  label: string;
  description?: string;
  primary?: boolean;
};

export const emergencyNumbers: EmergencyNumber[] = [
  {
    number: "112",
    label: "Unified Emergency",
    description: "Police · Fire · Ambulance",
    primary: true,
  },
  {
    number: "108",
    label: "Ambulance",
    description: "Free emergency ambulance",
  },
  {
    number: "1073",
    label: "Road Accident",
    description: "Road accident helpline",
  },
  {
    number: "1033",
    label: "NHAI Highway",
    description: "National highway emergency",
  },
  {
    number: "100",
    label: "Police",
    description: "National police helpline",
  },
  {
    number: "101",
    label: "Fire",
    description: "Fire brigade",
  },
  {
    number: "102",
    label: "Maternal Ambulance",
    description: "Medical / maternal ambulance",
  },
];
