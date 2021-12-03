import { PollutantFormula, PollutantName, PollutantUnit } from "interfaces";

export const applyPollutantName = (
  formula: PollutantFormula
): PollutantName => {
  switch (formula) {
    case "CO":
      return "Carbon Monoxide";
    case "NO2":
      return "Nitrogen Dioxide";
    case "O3":
      return "Ozone";
    case "PM10":
      return "Particulate Matter 10";
    case "PM2.5":
      return "Particulate Matter 2.5";
    case "SO2":
      return "Sulphur Dioxide";
    default:
      return "no name";
  }
};

export const applyPollutantUnit = (
  formula: PollutantFormula
): PollutantUnit => {
  switch (formula) {
    case "CO":
      return "ppm";
    case "NO2":
      return "ppb";
    case "O3":
      return "ppb";
    case "PM10":
      return "ug/m3";
    case "PM2.5":
      return "ug/m3";
    case "SO2":
      return "ppb";
    default:
      return "no unit";
  }
};
