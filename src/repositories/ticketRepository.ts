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
        ticket_code: string,
        customer_id: string,
        service_id: string,
    ): Promise<TicketDAO> {
        
        if (!ticket_code?.trim())
            throw new BadRequestError("ticket_code cannot be empty");
        if (!customer?.trim())
            throw new BadRequestError("customer cannot be empty");
        if (!service?.trim())
            throw new BadRequestError("service cannot be empty");
        if (isNaN(Number(ticket_code)))
    } */
}