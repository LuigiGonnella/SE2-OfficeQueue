import { readdirSync } from "node:fs";
import path from "node:path";

const APP_V1_BASE_URL = "/api/v1";
const URL_AUTH = "/auth";
const URL_USERS = "/users";
const URL_NETWORKS = "/networks";
const URL_GATEWAYS = "/:networkCode/gateways";
const URL_SENSORS = "/:gatewayMac/sensors";

export const CONFIG = {
	APP_PORT: process.env.PORT || 5000,

	SWAGGER_V1_FILE_PATH: path.resolve(__dirname, "../../doc/swagger_v1.yaml"),
	ROUTES: {
		V1_SWAGGER: `${APP_V1_BASE_URL}/doc`,
		V1_AUTH: APP_V1_BASE_URL + URL_AUTH,
		V1_USERS: APP_V1_BASE_URL + URL_USERS,
		V1_NETWORKS: APP_V1_BASE_URL + URL_NETWORKS,
		V1_GATEWAYS: APP_V1_BASE_URL + URL_NETWORKS + URL_GATEWAYS,
		V1_SENSORS: APP_V1_BASE_URL + URL_NETWORKS + URL_GATEWAYS + URL_SENSORS,
	},
	LOG_LEVEL: process.env.LOG_LEVEL || "info",
	LOG_PATH: process.env.LOG_PATH || "logs",
	ERROR_LOG_FILE: process.env.ERROR_LOG_FILE || "error.log",
	COMBINED_LOG_FILE: process.env.COMBINED_LOG_FILE || "combined.log",
};
