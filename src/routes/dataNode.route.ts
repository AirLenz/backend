import { Router } from "express";
import { ErrorController, DataNodeController } from "controllers";

export const dataNodeRouter: Router = Router();

dataNodeRouter
	.route("/")
	.get(DataNodeController.getNodeDataByDevice)
	.post(DataNodeController.createDataNode)
	.put(ErrorController.badRequest)
	.patch(ErrorController.badRequest)
	.delete(ErrorController.badRequest);
