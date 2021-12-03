import { Router } from "express";
import { ErrorController, RegionController } from "controllers";

export const regionRouter: Router = Router();

regionRouter
  .route("/")
  .get(RegionController.getRegions)
  .post(RegionController.addRegions)
  .put(ErrorController.badRequest)
  .patch(ErrorController.badRequest)
  .delete(ErrorController.badRequest);

regionRouter
  .route("/search")
  .get(RegionController.searchRegions)
  .post(ErrorController.badRequest)
  .put(ErrorController.badRequest)
  .patch(ErrorController.badRequest)
  .delete(ErrorController.badRequest);

regionRouter
  .route("/nearest")
  .get(RegionController.getNearestRegion)
  .post(ErrorController.badRequest)
  .put(ErrorController.badRequest)
  .patch(ErrorController.badRequest)
  .delete(ErrorController.badRequest);
