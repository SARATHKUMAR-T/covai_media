import { Router } from "express";
import { userMiddleware } from "../middlewares";
import { mediaController } from "../controllers/mediaController";
class MediaRoute {
  private static instance: MediaRoute;
  router = Router();
  private constructor() {
    this.initiateRoutes();
  }

  public static getInstance(): MediaRoute {
    if (!MediaRoute.instance) {
      MediaRoute.instance = new MediaRoute();
    }
    return MediaRoute.instance;
  }
  initiateRoutes() {
    this.router.route("/medias").put(mediaController.newMedia);
    this.router.route("/medias").get(mediaController.getAllMedia);
    this.router
      .route("/medias/:id")
      .get(mediaController.getMedia)
      .post(userMiddleware.mediaMiddleware, mediaController.updateMedia)
      .delete(userMiddleware.mediaMiddleware, mediaController.deleteMedia);
  }
}

export const MediaRouter = MediaRoute.getInstance();
