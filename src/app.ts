import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { CONFIG } from "@config";
import { errorHandler } from "@middlewares/errorMiddleware";
import cors from "cors";
import * as OpenApiValidator from "express-openapi-validator";
import customerRouter from "@routes/customerRoutes";
import ticketRouter from "@routes/ticketRoutes";
import serviceRouter from "@routes/serviceRoutes";
import queueRouter from "@routes/queueRoutes";
import counterRouter from "@routes/counterRoutes";
import "reflect-metadata";

export const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(
  CONFIG.ROUTES.V1_SWAGGER,
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(CONFIG.SWAGGER_V1_FILE_PATH))
);

app.use(
    OpenApiValidator.middleware({
    // use the same absolute path used by swagger-ui so the validator
    // can always find the spec regardless of current working directory
    apiSpec: CONFIG.SWAGGER_V1_FILE_PATH,
        validateApiSpec: true,
        validateRequests: true,
    })
)

app.use(CONFIG.ROUTES.V1_CUSTOMERS, customerRouter);
app.use(CONFIG.ROUTES.V1_SERVICES, serviceRouter);
app.use(CONFIG.ROUTES.V1_TICKETS, ticketRouter);
app.use(CONFIG.ROUTES.V1_QUEUES, queueRouter);
app.use(CONFIG.ROUTES.V1_COUNTERS, counterRouter)

//This must always be the last middleware added
app.use(errorHandler);


