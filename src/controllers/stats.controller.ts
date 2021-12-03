import { Request, Response } from "express";
import { PollutantFormula } from "interfaces";
import { StatsRepository } from "repositories";
import { HttpStatusCodes } from "utilities";

const get = async (req: Request, res: Response) => {
	const params = req.query;
	const view = params?.view as string;
	const pollutant = params?.pollutant as PollutantFormula;
	const date = params?.date as string;
	const startDate = params?.startDate as string;
	const endDate = params?.endDate as string;
	const region = params?.region as string;
	try {
		switch (view) {
			case "hourly":
				{
					const data = await StatsRepository.getHourly(pollutant, date, region);
					res.json(data);
				}
				break;
			case "daily":
				{
					const data = await StatsRepository.getDaily(
						pollutant,
						startDate,
						endDate,
						region
					);
					res.json(data);
				}
				break;
			case "monthly":
				{
					const data = await StatsRepository.getMonthly(pollutant, region);
					res.json(data);
				}
				break;
			default: {
				res.status(HttpStatusCodes.BAD_REQUEST).send("Invalid parameters");
			}
		}
	} catch (error) {
		res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
	}
};

export const StatsController = { get };
