import { Router } from "express";
import { mediaFineController } from "../controllers";
import { userMiddleware } from "../middlewares";
class MediaFineRoute {
  private static instance: MediaFineRoute;
  router = Router();
  private constructor() {
    this.initiateRoutes();
  }

  public static getInstance(): MediaFineRoute {
    if (!MediaFineRoute.instance) {
      MediaFineRoute.instance = new MediaFineRoute();
    }
    return MediaFineRoute.instance;
  }
  initiateRoutes() {
    this.router.route("/mediafine").put(mediaFineController.newMediaFine);
    this.router.route("/mediafine").get(mediaFineController.getAllMediaFine);
    this.router
      .route("/mediafine/:id")
      .get(mediaFineController.getMediaFine)
      .post(
        userMiddleware.mediaFineMiddleware,
        mediaFineController.updateMediaFine
      );
  }
}

export const MediaFineRouter = MediaFineRoute.getInstance();
