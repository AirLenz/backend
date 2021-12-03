import { Document } from "mongoose";

export type PollutantName =
	| "Carbon Monoxide"
	| "Particulate Matter 10"
	| "Particulate Matter 2.5"
	| "Ozone"
	| "Sulphur Dioxide"
	| "Nitrogen Dioxide"
	| "no name";

export type PollutantFormula = "CO" | "PM10" | "PM2.5" | "O3" | "SO2" | "NO2";

export type PollutantUnit = "ug/m3" | "ppm" | "ppb" | "no unit";

export interface PollutantInterface extends Document {
	name?: PollutantName;
	chemical_formula: PollutantFormula;
	concentration: number;
	aqi: number;
	unit: string;
}

interface Location {
	type: string;
	coordinates: number[];
}
export interface DataNodeInterface extends Document {
	location: Location;
	created: Date;
	levelId: string;
	name: string;
	deviceId: string;
	reason: string;
	value: number;
	status: string;
}

export interface DataNodeParams {
	levelId?: string;
	deviceId?: string;
}
