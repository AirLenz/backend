import { Schema, model } from "mongoose";
import { RegionInterface } from "interfaces";

const polygonSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const RegionShema = new Schema({
  location: polygonSchema,
  name: String,
  city: String,
  center: [Number],
});

RegionShema.pre<RegionInterface>("save", function (next) {
  this.name = `${this.name}, ${this.city}`;
  next();
});

RegionShema.index({ location: "2dsphere" });

export const Region = model<RegionInterface>("Region", RegionShema);
