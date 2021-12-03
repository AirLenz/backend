import { PollutantFormula } from "interfaces";

const AQI = (
  C: number,
  Imin: number,
  Imax: number,
  Cmin: number,
  Cmax: number
): number => {
  const Ic = ((Imax - Imin) / (Cmax - Cmin)) * (C - Cmin) + Imin;
  return Ic > 500 ? 500 : Ic;
};

export const calculateAQI = (
  formula: PollutantFormula,
  concentration: number,
  ozoneHours: number
): number => {
  const C = concentration;
  let Ic = 0.0;

  switch (formula) {
    case "PM2.5":
      if (C <= 12) {
        Ic = AQI(C, 0, 50, 0, 12);
      } else if (C > 12 && C <= 35.4) {
        Ic = AQI(C, 51, 100, 12.1, 35.4);
      } else if (C > 35.4 && C <= 55.4) {
        Ic = AQI(C, 101, 150, 34.6, 55.4);
      } else if (C > 55.4 && C <= 150.4) {
        Ic = AQI(C, 151, 200, 55.5, 150.4);
      } else if (C > 150.4 && C <= 250.4) {
        Ic = AQI(C, 201, 300, 150.5, 250.4);
      } else if (C > 250.4 && C <= 350.4) {
        Ic = AQI(C, 301, 400, 250.5, 350.4);
      } else if (C > 350.4) {
        Ic = AQI(C, 401, 500, 350.5, 500.4);
      }
      return Ic;

    case "CO":
      if (C <= 4.4) {
        Ic = AQI(C, 0, 50, 0, 4.4);
      } else if (C > 4.4 && C <= 9.4) {
        Ic = AQI(C, 51, 100, 4.5, 9.4);
      } else if (C > 9.4 && C <= 12.4) {
        Ic = AQI(C, 101, 150, 9.5, 12.4);
      } else if (C > 12.4 && C <= 15.4) {
        Ic = AQI(C, 151, 200, 12.5, 15.4);
      } else if (C > 15.4 && C <= 30.4) {
        Ic = AQI(C, 201, 300, 15.5, 30.4);
      } else if (C > 30.4 && C <= 40.4) {
        Ic = AQI(C, 301, 400, 30.5, 40.4);
      } else if (C > 40.4) {
        Ic = AQI(C, 401, 500, 40.5, 50.4);
      }
      return Ic;

    case "PM10":
      if (C <= 54) {
        Ic = AQI(C, 0, 50, 0, 54);
      } else if (C > 54 && C <= 154) {
        Ic = AQI(C, 51, 100, 55, 154);
      } else if (C > 154 && C <= 254) {
        Ic = AQI(C, 101, 150, 155, 254);
      } else if (C > 254 && C <= 354) {
        Ic = AQI(C, 151, 200, 255, 354);
      } else if (C > 354 && C <= 424) {
        Ic = AQI(C, 201, 300, 355, 424);
      } else if (C > 424 && C <= 504) {
        Ic = AQI(C, 301, 400, 425, 504);
      } else if (C > 504) {
        Ic = AQI(C, 401, 500, 505, 604);
      }
      return Ic;

    case "SO2":
      if (C <= 35) {
        Ic = AQI(C, 0, 50, 0, 35);
      } else if (C > 35 && C <= 75) {
        Ic = AQI(C, 51, 100, 36, 75);
      } else if (C > 75 && C <= 185) {
        Ic = AQI(C, 101, 150, 76, 185);
      } else if (C > 185 && C <= 304) {
        Ic = AQI(C, 151, 200, 186, 304);
      } else if (C > 304 && C <= 604) {
        Ic = AQI(C, 201, 300, 305, 604);
      } else if (C > 604 && C <= 804) {
        Ic = AQI(C, 301, 400, 605, 804);
      } else if (C > 804) {
        Ic = AQI(C, 401, 500, 805, 1004);
      }
      return Ic;

    case "NO2":
      if (C <= 53) {
        Ic = AQI(C, 0, 50, 0, 53);
      } else if (C > 53 && C <= 100) {
        Ic = AQI(C, 51, 100, 54, 100);
      } else if (C > 100 && C <= 360) {
        Ic = AQI(C, 101, 150, 101, 360);
      } else if (C > 360 && C <= 649) {
        Ic = AQI(C, 151, 200, 361, 649);
      } else if (C > 649 && C <= 1249) {
        Ic = AQI(C, 201, 300, 650, 1249);
      } else if (C > 1249 && C <= 1649) {
        Ic = AQI(C, 301, 400, 1250, 1649);
      } else if (C > 1649) {
        Ic = AQI(C, 401, 500, 1650, 2049);
      }
      return Ic;
    case "O3":
      if (ozoneHours == 8) {
        if (C <= 54) {
          Ic = AQI(C, 0, 50, 0, 54);
        } else if (C > 54 && C <= 70) {
          Ic = AQI(C, 51, 100, 55, 70);
        } else if (C > 70 && C <= 85) {
          Ic = AQI(C, 101, 150, 71, 85);
        } else if (C > 85 && C <= 105) {
          Ic = AQI(C, 151, 200, 86, 105);
        } else if (C > 105 && C <= 200) {
          Ic = AQI(C, 201, 300, 106, 200);
        }
        return Ic;
      } else if (ozoneHours == 1) {
        if (C > 124 && C <= 164) {
          Ic = AQI(C, 101, 150, 125, 164);
        } else if (C > 164 && C <= 204) {
          Ic = AQI(C, 151, 200, 165, 204);
        } else if (C > 204 && C <= 404) {
          Ic = AQI(C, 201, 300, 205, 404);
        } else if (C > 404 && C <= 504) {
          Ic = AQI(C, 301, 400, 405, 504);
        } else if (C > 504) {
          Ic = AQI(C, 401, 500, 505, 604);
        }
        return Ic;
      }
    default: {
      return 0;
    }
  }
};
