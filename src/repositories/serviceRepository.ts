import { AppDataSource } from "@database";
import { ServiceDAO } from "@models/dao/serviceDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Repository } from "typeorm";

export class ServiceRepository {
    private repo : Repository<ServiceDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(ServiceDAO);
    }

    // recupera tutti i services
    getAllServices(): Promise<ServiceDAO[]> {
        return this.repo.find();
    }

    // recupera un service dal suo id
    async getServiceById(id_service: number): Promise<ServiceDAO> {
        const service = await this.repo.findOne({ where: { id_service }});
        return findOrThrowNotFound(
            [service].filter((s): s is ServiceDAO => s !== null),
            () => true,
            `Service not found with id ${id_service}`
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
    async createService(serviceData: Partial<ServiceDAO>): Promise<ServiceDAO> {
        // Verifica che non esista già un servizio con lo stesso nome
        const existingService = await this.repo.findOne({ 
            where: { name: serviceData.name } 
        });
    
        // se trova un servizio esistente con lo stesso nome, lancia un errore
        await throwConflictIfFound(
            [existingService], 
            () => true,
            `Service with name ${serviceData.name} already exists`
        );

        const service = this.repo.create(serviceData);
        return this.repo.save(service);
    }

    // elimina un service esistente dato il suo id
    async deleteService(id_service: number): Promise<void> {
        const service = await this.getServiceById(id_service);
        await this.repo.remove(service);
    }
}