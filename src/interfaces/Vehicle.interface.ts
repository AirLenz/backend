import { Document } from "mongoose";

type VehicleType = "bike" | "rickshaw" | "bus";

export interface VehicleInterface extends Document {
  registration_id: string;
  type: VehicleType;
  sensor_id: string;
}
