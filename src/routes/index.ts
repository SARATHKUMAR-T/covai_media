import { Application, NextFunction, Request, Response } from "express";
import { erroHandler } from "../middlewares/errorHandlerMiddleware";
import { MediaFineRouter } from "./mediaFineRoute";
import { MediaRouter } from "./mediaRoute";
import { MediaTrackingRouter } from "./mediaTrackingRoute";
import { userRouter } from "./userRoute";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", userRouter.router);
    app.use("/api", MediaRouter.router);
    app.use("/api", MediaTrackingRouter.router);
    app.use("/api", MediaFineRouter.router);
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new Error("cannot find this route"));
    });

    app.use(erroHandler.globalErrorHandler);
  }
}
