import { Document } from "mongoose";

export interface GeoCordinateInterface {
  latitude: number | string;
  longitude: number | string;
}

export interface PolygonInterface {
  type: string;
  coordinates: number[][][];
}

export interface RegionInterface extends Document {
  location: PolygonInterface;
  center: number[];
  city: string;
  name: string;
}
