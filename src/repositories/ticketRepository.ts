import { AppDataSource } from "@database";
import { TicketDAO } from "@models/dao/ticketDAO";
import { CustomerDAO } from "@models/dao/customerDAO";
import { ServiceDAO } from "@models/dao/serviceDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Repository, UpdateResult } from "typeorm";
import { NotFoundError } from "@models/errors/NotFoundError";
import { BadRequestError } from "@models/errors/BadRequestError";


export class TicketRepository {
    private repo: Repository<TicketDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(TicketDAO);
        //this.customerRepo = AppDataSource.getRepository(CustomerDAO);
        //this.serviceRepo = AppDataSource.getRepository(ServiceDAO);
    }

    getAllTickets(): Promise<TicketDAO[]> {
        return this.repo.find();
    }

    async getTicketByCode(ticket_code: number): Promise<TicketDAO> {
        return findOrThrowNotFound(
            await this.repo.find({ where: { ticket_code } }),
            () => true,
            `Ticket with code ${ticket_code} not found`
        );
    }
/*
    async createTicket(
        ticket_code: number,
        customer_id: number,
        service_id: number
    ): Promise<TicketDAO> {
        
        if (!ticket_code || !customer_id || !service_id) {
            throw new BadRequestError("ticket_code, customer_id and service_id are required");
        }

        throwConflictIfFound(
            await this.repo.find({ where: { ticket_code } }),
            () => true,
            `Ticket with code ${ticket_code} already exists`
        );

        
        const customer = findOrThrowNotFound(
            await customerRepo.find({ where: { customer_id } }),
            () => true,
            `Customer with id ${customer_id} not found`
        );

        const service = findOrThrowNotFound(
            await serviceRepo.find({ where: { service_id } }),
            () => true,
            `Service with id ${service_id} not found`
        );

        return this.repo.save({
            ticket_code,
            customer,
            service
        });
        
    }

*/
}