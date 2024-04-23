import { NextFunction, Request, Response } from "express";
import { userService } from "../services";

class UserController {
  private static instance: UserController;

  private constructor() {}

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.fetchUser(req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.allUsers();
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async newUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.addUser(req.body);
      if (result) {
        res.status(result.status).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.updateUser(req.query, req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async searchMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.search(req.query);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  public async bookMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.bookingMedia(
        req.params.id,
        req.body.user
      );
      if (result) res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.removeUser(req.params.id);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = UserController.getInstance();
