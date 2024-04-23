import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";
import Routes from "./routes";
import { availablityScheduler, fineScheduler } from "./scheduler";

class Server {
  private static instance: Server;
  private app: Application = express();
  private PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;

  private constructor() {
    this.config();
    this.setUpRoutes();
    this.start();
    this.scheduler();
  }

  public static getInstance() {
    if (!this.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  set portNumber(port: number) {
    this.PORT = port;
  }

  get portNumber(): number {
    return this.PORT;
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan("combined"));
  }

  private setUpRoutes(): void {
    new Routes(this.app);
  }

  private scheduler(): void {
    setInterval(() => {
      fineScheduler();
      availablityScheduler();
    }, 300000);
  }

  private start() {
    this.app
      .listen(this.PORT, (): void => {
        console.log(`Server is listening on ${this.PORT}`);
      })
      .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log("server already in use");
        } else {
          console.log("unable to run a server");
          console.log(err);
        }
      });
  }
}

const nodeServer = Server.getInstance();

nodeServer.portNumber = process.env.PORT
  ? parseInt(process.env.PORT)
  : nodeServer.portNumber;
