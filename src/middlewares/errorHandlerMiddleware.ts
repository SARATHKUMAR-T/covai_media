import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ErrorHandler {
  constructor() {}

  async globalErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
}

export const erroHandler = new ErrorHandler();
