import { Schema, model } from "mongoose";

const SensorNodeShema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
  },
  {
    _id: false,
  }
);

export const SensorNode = model("SensorNode", SensorNodeShema);
