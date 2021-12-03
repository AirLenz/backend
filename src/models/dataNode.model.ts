import { Schema, model } from "mongoose";
import { DataNodeInterface, PollutantInterface } from "interfaces";
import {
	applyPollutantName,
	calculateAQI,
	applyPollutantUnit,
} from "utilities";

const PointSchema = new Schema({
	type: {
		type: String,
		enum: ["Point"],
		required: true,
		default: "Point",
	},
	coordinates: {
		type: [Number],
		required: true,
	},
});

const Pollutant = new Schema(
	{
		chemical_formula: String,
		name: String,
		concentration: Number,
		aqi: Number,
		unit: String,
	},
	{
		_id: false,
	}
);

Pollutant.pre<PollutantInterface>("save", function (next) {
	this.name = applyPollutantName(this.chemical_formula);
	this.unit = applyPollutantUnit(this.chemical_formula);
	this.aqi = calculateAQI(this.chemical_formula, this.concentration, 8);
	next();
});

const DataNodeSchema = new Schema({
	created: Date,
	levelId: String,
	name: String,
	deviceId: String,
	reason: String,
	value: Number,
	status: String,
	location: PointSchema,
});

DataNodeSchema.pre<DataNodeInterface>("save", function (next) {
	if (!this.created) {
		this.created = new Date();
	}
	next();
});

DataNodeSchema.index({ location: "2dsphere" });

export const DataNode = model<DataNodeInterface>("DataNode", DataNodeSchema);
