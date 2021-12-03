import { Request, Response } from "express";
import { HttpStatusCodes } from "utilities";
import { RegionRepository } from "repositories";
import { RegionInterface } from "interfaces";

const getRegions = async (req: Request, res: Response) => {
  try {
    const regions = await RegionRepository.getRegions();
    res.send(regions);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const addRegions = async (req: Request, res: Response) => {
  const regions: RegionInterface[] = req.body;
  try {
    await RegionRepository.addRegions(regions);
    res.send(`${regions.length} Regions Added`);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const searchRegions = async (req: Request, res: Response) => {
  const searchQuery = req.query?.query as string;
  try {
    const regions = await RegionRepository.searchRegions(searchQuery);
    res.send(regions);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const getNearestRegion = async (req: Request, res: Response) => {
  const latitude = req.query?.latitude as any as number;
  const longitude = req.query?.longitude as any as number;
  try {
    const regions = await RegionRepository.getNearestRegion(
      latitude,
      longitude
    );
    res.send(regions);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const RegionController = {
  getRegions,
  addRegions,
  searchRegions,
  getNearestRegion,
};
