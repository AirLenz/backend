import { Router } from "express";
import { ErrorController, MapDataController } from "controllers";

export const mapDataRouter: Router = Router();

mapDataRouter
  .route("/")
  .get(MapDataController.getMapData)
  .post(ErrorController.badRequest)
  .put(ErrorController.badRequest)
  .patch(ErrorController.badRequest)
  .delete(ErrorController.badRequest);
