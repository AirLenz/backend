import express from "express";
import cors from "cors";
import helmet from "helmet";
import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import AdminBroMongoose from "@admin-bro/mongoose";
import { Environment, log } from "utilities";
import {
  statsRouter,
  mapDataRouter,
  regionRouter,
  dataNodeRouter,
} from "routes";
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import createMemoryStore from "memorystore";
import "crons";

const MemoryStore = createMemoryStore(session);

export class App {
  private app: express.Application;

  constructor(connection: typeof mongoose) {
    this.app = express();
    this.setupAdminPanel(connection);
    this.setupMiddlewares();
    this.setupRoutes();
  }

  public listen() {
    this.app.listen(Environment.PORT, () => {
      log(`Listening on port ${Environment.PORT}`);
    });
  }

  private setupMiddlewares() {
    this.app.use("/", express.static(path.join(__dirname, "public")));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private setupAdminPanel(connection: typeof mongoose) {
    AdminBro.registerAdapter(AdminBroMongoose);
    const adminBro = new AdminBro({
      databases: [connection],
      rootPath: "/admin",
    });
    const adminRouter = AdminBroExpress.buildAuthenticatedRouter(
      adminBro,
      {
        authenticate: async (email, password) => {
          if (
            email === Environment.ADMIN_EMAIL &&
            password === Environment.ADMIN_PASSWORD
          ) {
            return {
              email: Environment.ADMIN_EMAIL,
            };
          } else {
            return null;
          }
        },
        cookieName: "adminbro",
        cookiePassword: "somePassword",
      },
      null,
      {
        resave: false,
        saveUninitialized: true,
        secret: "keyboard cat",
        store: new MemoryStore({
          checkPeriod: 86400000,
        }),
      }
    );
    this.app.use("/admin", adminRouter);
  }

  private setupRoutes() {
    this.app.use("/api/v1/data-node/", dataNodeRouter);
    this.app.use("/api/v1/visualize-map/", mapDataRouter);
    this.app.use("/api/v1/region/", regionRouter);
    this.app.use("/api/v1/stats/", statsRouter);
  }
}
