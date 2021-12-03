import { PollutantFormula } from "interfaces";
import { DataNode } from "models";
import { RegionRepository } from "repositories";
import moment from "moment";

const mappedNames = (name: string): string => {
	if (name === "Carbon Monoxide(CO)") {
		return "CO";
	} else if (name === "Dust(pm 1.0)") {
		return "PM1.0";
	} else if (name === "Nitrogen Dioxide (NO2)") {
		return "NO2";
	} else if (name === "Dust(pm 10.0)") {
		return "PM10.0";
	} else if (name === "Sulfur Dioxide (SO2)") {
		return "SO2";
	} else if (name === "Dust(pm 2.5)") {
		return "PM2.5";
	} else if (name === "Ozone(O3)") {
		return "O3";
	} else {
		return "no name";
	}
};

const unMapName = (name: string): string => {
	if (name === "CO") {
		return "Carbon Monoxide(CO)";
	} else if (name === "PM1.0") {
		return "Dust(pm 1.0)";
	} else if (name === "NO2") {
		return "Nitrogen Dioxide (NO2)";
	} else if (name === "PM10.0") {
		return "Dust(pm 10.0)";
	} else if (name === "SO2") {
		return "Sulfur Dioxide (SO2)";
	} else if (name === "PM2.5") {
		return "Dust(pm 2.5)";
	} else if (name === "O3") {
		return "Ozone(O3)";
	} else {
		return "no name";
	}
};

const daysDifference = (dt1: Date, dt2: Date): number => {
	return Math.abs(
		Math.ceil(
			(Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
				Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
				(1000 * 60 * 60 * 24)
		)
	);
};
const getDaily = (
	pollutant: PollutantFormula,
	startDate: string,
	endDate: string,
	regionId: string
) => {
	return new Promise(async (res, rej) => {
		try {
			const region = await RegionRepository.getRegionbyId(regionId);
			var _startDate = moment(startDate).startOf("day");
			var _endDate = moment(endDate).add(1, "day").startOf("day");

			const pipeline = [
				{
					$match: {
						created: {
							$gte: _startDate.toDate(),
							$lt: _endDate.toDate(),
						},
						location: {
							$geoWithin: {
								$geometry: region?.location,
							},
						},
						name: unMapName(pollutant),
					},
				},
				{
					$project: {
						year: { $year: "$created" },
						month: { $month: "$created" },
						day: { $dayOfMonth: "$created" },
						value: "$value",
					},
				},
				{
					$group: {
						_id: { day: "$day", month: "$month", year: "$year" },
						mean: { $avg: "$value" },
						max: { $max: "$value" },
						min: { $min: "$value" },
					},
				},
			];

			const data = await DataNode.aggregate(pipeline);

			const daysDiff = daysDifference(_startDate.toDate(), _endDate.toDate());

			const average: any = {};
			const minimum: any = {};
			const maximum: any = {};

			for (let i = 0; i < daysDiff; i++) {
				average[i] = 0;
				minimum[i] = 0;
				maximum[i] = 0;
			}

			data.forEach((node) => {
				const difference = daysDifference(
					_startDate.toDate(),
					new Date(`${node?._id?.year}-${node?._id?.month}-${node?._id?.day}`)
				);

				average[difference] = node?.mean;
				minimum[difference] = node?.min;
				maximum[difference] = node?.max;
			});

			const response = {
				average: Object.values(average),
				maximum: Object.values(maximum),
				minimum: Object.values(minimum),
			};

			res(response);
		} catch (error) {
			rej(error);
		}
	});
};

const getHourly = (
	pollutant: PollutantFormula,
	date: string,
	regionId: string
) => {
	return new Promise(async (res, rej) => {
		try {
			const temp = new Date(date);
			temp.setHours(0);
			temp.setMinutes(0);
			temp.setSeconds(0);
			const region = await RegionRepository.getRegionbyId(regionId);

			var startDate = new Date(temp);
			var endDate = new Date(temp.setDate(temp.getDate() + 1));

			var pipeline = [
				{
					$match: {
						created: {
							$gte: startDate,
							$lt: endDate,
						},
						location: {
							$geoWithin: {
								$geometry: region?.location,
							},
						},
						name: unMapName(pollutant),
					},
				},
				{
					$project: {
						h: { $hour: "$created" },
						name: "$name",
						value: "$value",
					},
				},
				{
					$group: {
						_id: { hour: "$h", name: "$name" },
						mean: { $avg: "$value" },
						max: { $max: "$value" },
						min: { $min: "$value" },
					},
				},
			];

			const nodes = await DataNode.aggregate(pipeline);

			const response: any = {};

			for (let i = 0; i < 24; i++) {
				response[i] = {
					mean: 0,
					max: 0,
					min: 0,
				};
			}
			nodes.forEach((i) => {
				response[i?._id?.hour] = {
					mean: i?.mean,
					max: i?.max,
					min: i?.min,
				};
			});

			res(response);
		} catch (error) {
			console.log(error);
			rej(error);
		}
	});
};

const getMonthly = (pollutant: PollutantFormula, regionId: string) => {
	return new Promise(async (res, rej) => {
		try {
			const region = await RegionRepository.getRegionbyId(regionId);
			const startDate = moment().startOf("year");
			const endDate = moment().endOf("year");

			const pipeline = [
				{
					$match: {
						created: {
							$gte: startDate.toDate(),
							$lt: endDate.toDate(),
						},
						location: {
							$geoWithin: {
								$geometry: region?.location,
							},
						},
						name: unMapName(pollutant),
					},
				},
				{
					$project: {
						month: { $month: "$created" },
						value: "$value",
					},
				},
				{
					$group: {
						_id: { month: "$month" },
						mean: { $avg: "$value" },
						max: { $max: "$value" },
						min: { $min: "$value" },
					},
				},
			];

			const data = await DataNode.aggregate(pipeline);

			const average: any = {};
			const minimum: any = {};
			const maximum: any = {};

			for (let i = 0; i < 12; i++) {
				average[i] = 0;
				minimum[i] = 0;
				maximum[i] = 0;
			}

			data.forEach((node) => {
				average[node?._id?.month] = node?.mean;
				minimum[node?._id?.month] = node?.min;
				maximum[node?._id?.month] = node?.max;
			});

			const response = {
				average: Object.values(average),
				maximum: Object.values(maximum),
				minimum: Object.values(minimum),
			};

			res(response);
		} catch (error) {
			rej(error);
		}
	});
};

export const StatsRepository = {
	getHourly,
	getMonthly,
	getDaily,
};
