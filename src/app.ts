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

export const app = express();

app.use(express.json());
app.use(cors());

app.use(
  CONFIG.ROUTES.V1_SWAGGER,
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(CONFIG.SWAGGER_V1_FILE_PATH))
);

app.use(
    OpenApiValidator.middleware({
        apiSpec: './doc/swagger_v1.yaml',
        validateApiSpec: true,
        validateRequests: true,
        validateResponses: true,
    })
)

app.use(CONFIG.ROUTES.V1_CUSTOMERS, customerRouter);
app.use(CONFIG.ROUTES.V1_SERVICES, serviceRouter);
app.use(CONFIG.ROUTES.V1_TICKETS, ticketRouter);

//This must always be the last middleware added
app.use(errorHandler);
