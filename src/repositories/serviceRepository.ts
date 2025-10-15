import { AppDataSource } from "@database";
import { ServiceDAO } from "@models/dao/serviceDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Repository } from "typeorm";
import AppError from "@models/errors/AppError";

export class ServiceRepository {
    private repo : Repository<ServiceDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(ServiceDAO);
    }

    // recupera tutti i services
    async getAllServices(): Promise<ServiceDAO[]> {
        return await this.repo.find();
    }

    // recupera un service dal suo id
    async getServiceById(id: number): Promise<ServiceDAO> {
        const service = await this.repo.findOne({ where: { id }});
        return findOrThrowNotFound(
            [service].filter((s): s is ServiceDAO => s !== null),
            () => true,
            `Service not found`
        );
    }

    //recupera un service dal suo nome
    async getServiceByName(name: string): Promise<ServiceDAO> {
        const service = await this.repo.findOne({ where: { name } });
        return findOrThrowNotFound(
            [service].filter((s): s is ServiceDAO => s !== null),
            () => true,
            `Service not found with name ${name}`
        );
    }

    // crea un nuovo service
    async createService(
        name: string,
        description?: string
    ): Promise<void> {
        // Verifica che non esista già un servizio con lo stesso nome
        if (!name || name.trim().length < 1) {
            throw new AppError("Invalid input data", 400);
        }
    
        name = name.trim();
        throwConflictIfFound(
            await this.repo.find({ where: { name}}),
            () => true,
            `Service already exists with name ${name}`,
        );

        await this.repo.save({ name, description});
    }

    // elimina un service esistente dato il suo nome
    async deleteService(name: string): Promise<void> {
        const service = await this.getServiceByName(name);
        await this.repo.remove(service);
    }
}