import { Router } from "express";
import { ErrorController, StatsController } from "controllers";

export const statsRouter: Router = Router();

statsRouter
	.route("/")
	.get(StatsController.get)
	.post(ErrorController.badRequest)
	.put(ErrorController.badRequest)
	.patch(ErrorController.badRequest)
	.delete(ErrorController.badRequest);
