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
    if (err.message == "invalid file format") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "unsupported file format,please upload excelsheet only",
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
}

export const erroHandler = new ErrorHandler();
