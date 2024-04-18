import { NextFunction, Request, Response } from "express";
import { mediaTrackingService } from "../services/mediaTrackingService";

class MediaTrackingController {
  private static instance: MediaTrackingController;

  private constructor() {}

  public static getInstance(): MediaTrackingController {
    if (!MediaTrackingController.instance) {
      MediaTrackingController.instance = new MediaTrackingController();
    }
    return MediaTrackingController.instance;
  }

  public async getMediaTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaTrackingService.fetchMediaTracking(
        req.params.id
      );
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async getAllMediaTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaTrackingService.allMediaTracking();
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async newMediaTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaTrackingService.addMediaTracking(req.body);
      if (result) {
        res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async updateMediaTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaTrackingService.updateMediaTracking(
        req.query,
        req.params.id
      );
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteMediaTracking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaTrackingService.removeMediaTracking(
        req.params.id
      );
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaTrackingController = MediaTrackingController.getInstance();
