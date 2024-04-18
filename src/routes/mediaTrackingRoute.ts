import { Router } from "express";
import { mediaTrackingController } from "../controllers/mediaTrackingController";
import { userMiddleware } from "../middlewares";
class MediaTrackingRoute {
  private static instance: MediaTrackingRoute;
  router = Router();
  private constructor() {
    this.initiateRoutes();
  }

  public static getInstance(): MediaTrackingRoute {
    if (!MediaTrackingRoute.instance) {
      MediaTrackingRoute.instance = new MediaTrackingRoute();
    }
    return MediaTrackingRoute.instance;
  }
  initiateRoutes() {
    this.router
      .route("/mediatracking")
      .put(mediaTrackingController.newMediaTracking);
    this.router
      .route("/mediatracking")
      .get(mediaTrackingController.getAllMediaTracking);
    this.router
      .route("/mediatracking/:id")
      .get(mediaTrackingController.getMediaTracking)
      .post(
        userMiddleware.mediaTrackingMiddleware,
        mediaTrackingController.updateMediaTracking
      )
      .delete(
        userMiddleware.mediaTrackingMiddleware,
        mediaTrackingController.deleteMediaTracking
      );
  }
}

export const MediaTrackingRouter = MediaTrackingRoute.getInstance();
