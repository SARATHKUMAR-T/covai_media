import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { mediaService, userService } from "../services";
import { mediaTrackingService } from "../services/mediaTrackingService";
import { mediaFineService } from "../services/mediaFineService";
import { tokenDecoder } from "../utils";
import { StatusCodes } from "http-status-codes";
import { APIresponse } from "../types";

class MiddlewareController {
  private static instance: MiddlewareController;
  private constructor() {}
  public static getInstance(): MiddlewareController {
    if (!MiddlewareController.instance) {
      MiddlewareController.instance = new MiddlewareController();
    }
    return MiddlewareController.instance;
  }
  public async tokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.headers["x-auth-token"]) {
        const token = req.headers["x-auth-token"];
        if (typeof token === "string") {
          const decoded: any = tokenDecoder(token);
          const result = await userService.fetchUser(decoded.val.id);
          req.body.user = result.data;
          if ((result.status = 200)) next();
          else {
            return res.status(result.status).json(result);
          }
        }
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            new APIresponse<null>(
              true,
              StatusCodes.UNAUTHORIZED,
              "invaild token"
            )
          );
      }
    } catch (error) {
      next(error);
    }
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
