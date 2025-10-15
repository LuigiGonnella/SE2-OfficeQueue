import { CONFIG } from "../src/config/config";
import { AppDataSource } from "../src/database/connection";
import { DataSource } from "typeorm";

export const TestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  entities: CONFIG.DB_ENTITIES
});

export async function initializeTestDataSource(): Promise<void> {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
    Object.assign(AppDataSource, TestDataSource);
  }
}

export async function closeTestDataSource(): Promise<void> {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
}
