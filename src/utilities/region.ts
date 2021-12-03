import { Environment } from "utilities";
import {
  Client,
  ReverseGeocodeResponse,
} from "@googlemaps/google-maps-services-js";

const client = new Client({});

interface Region {
  name: string;
  key: string;
}

export const getRegion = (
  latitude: string | number,
  longitude: string | number
): Promise<Region> => {
  return new Promise<Region>(async (res, rej) => {
    try {
      const response: ReverseGeocodeResponse = await client.reverseGeocode({
        params: {
          latlng: `${latitude},${longitude}`,
          key: Environment.GOOGLE_MAPS_API_KEY,
        },
      });
      if (response.data.results.length > 0) {
        const region = response.data.results[0].formatted_address
          .split(",")
          .reverse()[3]
          .trim();
        const region_key = region.toLowerCase().replace(/ /g, "_");
        res({ name: region, key: region_key });
      } else {
        throw "No Location Found";
      }
    } catch (error) {
      rej(error);
    }
  });
};
