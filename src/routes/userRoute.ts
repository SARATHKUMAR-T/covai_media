import { Router } from "express";
import { userController } from "../controllers";
import { userMiddleware } from "../middlewares";
class userRoute {
  private static instance: userRoute;
  router = Router();
  private constructor() {
    this.initiateRoutes();
  }

  public static getInstance(): userRoute {
    if (!userRoute.instance) {
      userRoute.instance = new userRoute();
    }
    return userRoute.instance;
  }
  initiateRoutes() {
    this.router.route("/users").put(userController.newUser);
    this.router.route("/users").get(userController.getAllUser);
    this.router.route("/search/:query").get(userController.searchMedia);
    this.router
      .route("/book/:id")
      .post(userMiddleware.tokenMiddleware, userController.bookMedia);
    this.router
      .route("/users/:id")
      .get(userController.getUser)
      .post(userMiddleware.authMiddleware, userController.updateUser)
      .delete(userMiddleware.authMiddleware, userController.deleteUser);
  }
}

export const userRouter = userRoute.getInstance();
