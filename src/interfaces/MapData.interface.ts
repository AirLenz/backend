import { GeoCordinateInterface } from "interfaces";
import {
	PollutantFormula,
	PollutantName,
	PollutantUnit,
} from "./DataNode.interface";

export interface DataPoint extends GeoCordinateInterface {
	value: number;
	name: string;
	latitude: number;
	longitude: number;
}

interface Pollutant {
	name: PollutantName;
	unit: PollutantUnit;
	formula: PollutantFormula;
	concentration: number;
	aqi: number;
}

export interface MapData {
	region: {
		name: string;
		bounds: number[][];
		center: number[];
	};
	pollutants: Pollutant[];
	dataPoints: DataPoint[];
}
