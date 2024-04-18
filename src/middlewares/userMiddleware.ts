import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { mediaService, userService } from "../services";
import { mediaTrackingService } from "../services/mediaTrackingService";
import { mediaFineService } from "../services/mediaFineService";

class MiddlewareController {
  private static instance: MiddlewareController;
  private constructor() {}
  public static getInstance(): MiddlewareController {
    if (!MiddlewareController.instance) {
      MiddlewareController.instance = new MiddlewareController();
    }
    return MiddlewareController.instance;
  }

  public async authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.fetchUser(req.params.id);
      if (result.status === 200) next();
      else {
        return res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async mediaMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaService.fetchMedia(req.params.id);

      if (result.status === 200) next();
      else {
        return res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async mediaFineMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaFineService.fetchMediaFine(req.params.id);

      if (result.status === 200) next();
      else {
        return res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async mediaTrackingMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await mediaTrackingService.fetchMediaTracking(
        req.params.id
      );

      if (result.status === 200) next();
      else {
        return res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
}

export const userMiddleware = MiddlewareController.getInstance();
