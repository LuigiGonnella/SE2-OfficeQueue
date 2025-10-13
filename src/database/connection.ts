import "reflect-metadata";
import { DataSource } from "typeorm";
import { CONFIG } from "@config";
import { logError, logInfo } from "@services/loggingService";

export const AppDataSource = new DataSource({
  type: CONFIG.DB_TYPE as "sqlite",
  database: CONFIG.DB_NAME,
  entities: CONFIG.DB_ENTITIES,
  synchronize: true,
  logging: true,
});

export async function initializeDatabase() {
  await AppDataSource.initialize();
  logInfo("Successfully connected to DB");
}

export async function closeDatabase() {
  try {
    await AppDataSource.destroy();
    logInfo("Database connection closed.");
  } catch (error) {
    logError("Error while closing database:", error);
  }
}