import { Schema, model } from "mongoose";

const VehicleSchema = new Schema({
  registration_id: String,
  type: String,
  sensor_id: String,
});

export const Vehicle = model("Vehicle", VehicleSchema);
