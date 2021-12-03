import { Request, Response } from "express";
import { HttpStatusCodes } from "utilities";
import { MapDataRepository } from "repositories";

const getMapData = async (req: Request, res: Response) => {
	const regionId = req.query?.regionId as string;

	try {
		const data = await MapDataRepository.getMapData(regionId);
		res.json(data);
	} catch (error) {
		res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
	}
};

export const MapDataController = { getMapData };
