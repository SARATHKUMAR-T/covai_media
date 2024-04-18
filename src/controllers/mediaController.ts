import { NextFunction, Request, Response } from "express";
import { mediaService } from "../services";

class MediaController {
  private static instance: MediaController;

  private constructor() {}

  public static getInstance(): MediaController {
    if (!MediaController.instance) {
      MediaController.instance = new MediaController();
    }
    return MediaController.instance;
  }

  public async getMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaService.fetchMedia(req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async getAllMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaService.allMedias();
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async newMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaService.addMedia(req.body);
      if (result) {
        res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async updateMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaService.updateMedia(req.query, req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await mediaService.removeMedia(req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = MediaController.getInstance();
