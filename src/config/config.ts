import { readdirSync } from "node:fs";
import path from "node:path";

const APP_V1_BASE_URL = "/api/v1";
const URL_AUTH = "/auth";
const URL_CUSTOMERS = "/customers";
const URL_SERVICES = "/services";
const URL_TICKETS = "/tickets";

export const CONFIG = {
	APP_PORT: process.env.PORT || 8080,

	SWAGGER_V1_FILE_PATH: path.resolve(__dirname, "../../doc/swagger_v1.yaml"),
	ROUTES: {
		V1_SWAGGER: `${APP_V1_BASE_URL}/doc`,
		V1_AUTH: APP_V1_BASE_URL + URL_AUTH,
		V1_CUSTOMERS: APP_V1_BASE_URL + URL_CUSTOMERS,
		V1_SERVICES: APP_V1_BASE_URL + URL_SERVICES,
		V1_TICKETS: APP_V1_BASE_URL + URL_TICKETS
	},
	LOG_LEVEL: process.env.LOG_LEVEL || "info",
	LOG_PATH: process.env.LOG_PATH || "logs",
	ERROR_LOG_FILE: process.env.ERROR_LOG_FILE || "error.log",
	COMBINED_LOG_FILE: process.env.COMBINED_LOG_FILE || "combined.log",
};
