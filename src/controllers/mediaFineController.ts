import { NextFunction, Request, Response } from "express";
import { mediaFineService } from "../services/mediaFineService";

class MediaFineController {
  private static instance: MediaFineController;

  private constructor() {}

  public static getInstance(): MediaFineController {
    if (!MediaFineController.instance) {
      MediaFineController.instance = new MediaFineController();
    }
    return MediaFineController.instance;
  }

  public async getMediaFine(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaFineService.fetchMediaFine(req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async getAllMediaFine(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaFineService.allMediaFines();
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async newMediaFine(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaFineService.addMediaFine(req.body);
      if (result) {
        res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async updateMediaFine(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaFineService.updateMediaFine(
        req.query,
        req.params.id
      );
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async mediaFineReport(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaFineService.mediaFineStatics(req.body);
      if (result) res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaFineController = MediaFineController.getInstance();
