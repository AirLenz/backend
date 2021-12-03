import { Request, Response } from "express";
import { DataNodeInterface, DataNodeParams } from "interfaces";
import { HttpStatusCodes } from "utilities";
import { DataNodeRepository } from "repositories";

const createDataNode = async (req: Request, res: Response) => {
	const dataNode: DataNodeInterface[] = req.body;
	try {
		await DataNodeRepository.createDataNode(dataNode);
		res.json(`data nodes added`);
	} catch (error) {
		res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
	}
};

const getNodeDataByDevice = async (req: Request, res: Response) => {
	const deviceInfo: DataNodeParams = req.query;
	if (!deviceInfo) {
		res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);
	}
	try {
		const dataNodes = await DataNodeRepository.getNodeDateByDevice(deviceInfo);
		res.json(dataNodes);
	} catch (error) {
		res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
	}
};

export const DataNodeController = { createDataNode, getNodeDataByDevice };
