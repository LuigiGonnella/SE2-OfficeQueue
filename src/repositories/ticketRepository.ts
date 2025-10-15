import { AppDataSource } from "@database";
import { TicketDAO } from "@models/dao/ticketDAO";
import { CustomerDAO } from "@models/dao/customerDAO";
import { ServiceDAO } from "@models/dao/serviceDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Repository } from "typeorm";
import { NotFoundError } from "@models/errors/NotFoundError";
import { BadRequestError } from "@models/errors/BadRequestError";
import {QueueDAO} from "@dao/queueDAO";


export class TicketRepository {
    private repo: Repository<TicketDAO>;    
    private customerRepo: Repository<CustomerDAO>;
    private serviceRepo: Repository<ServiceDAO>;
    private queueRepo: Repository<QueueDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(TicketDAO);
        this.customerRepo = AppDataSource.getRepository(CustomerDAO);
        this.serviceRepo = AppDataSource.getRepository(ServiceDAO);
        this.queueRepo = AppDataSource.getRepository(QueueDAO);
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

    async createTicket(
        customer_id: number,
        id_service: number
    ): Promise<TicketDAO> {

        if(!customer_id){
            throw new BadRequestError("Customer ID is required");
        }

        if(!id_service){
            throw new BadRequestError("Service ID is required");
        }

        
        const customer = findOrThrowNotFound(
            await this.customerRepo.find({ where: { customer_id } }),
            () => true,
            `Customer with id ${customer_id} not found`
        );

        const service = findOrThrowNotFound(
            await this.serviceRepo.find({ where: { id: id_service } }),
            () => true,
            `Service with id ${id_service} not found`
        );

        const ticket2 = await this.repo.save({
            customer,
            service
        });

        const ticket = await this.repo.findOne({where: {ticket_code: ticket2.ticket_code}, relations: ['service', 'customer']})

        if (!ticket) {
            throw new NotFoundError(`Ticket with code ${ticket2.ticket_code} not found after creation`);
        }

        await this.queueRepo.save({ticket: ticket});

        return ticket;
    }

    async getTicketByTicketCode(ticket_code: number): Promise<TicketDAO> {
        return findOrThrowNotFound(
            await this.repo.find({ where: { ticket_code } }),
            () => true,
            `Ticket with code ${ticket_code} not found`
        );
    }

    async getTicketsByServiceCode(service_code: number): Promise<TicketDAO[]> {
        findOrThrowNotFound(
            await this.serviceRepo.find({ where: { id: service_code } }),
            () => true,
            `Service with code ${service_code} not found`
        );

        return this.repo.find({
            where: { service: { id: service_code } },
            relations: ['service', 'customer']
        });
    }

        async getQueueLengthsByService(): Promise<{ id_service: number; service_name: string; waiting_count: number; }[]> {
        const allServices = await this.serviceRepo.find();
        if (!allServices || allServices.length === 0) {
            throw new NotFoundError("No services found");
        }

        const query = await this.repo.createQueryBuilder("ticket")
            .leftJoin("ticket.service", "service")
            .select("service.id", "id_service")
            .addSelect("service.name", "service_name")
            .addSelect("COUNT(ticket.ticket_code)", "waiting_count")
            .where("ticket.status = :status", { status: "waiting" })
            .groupBy("service.id")
            .addGroupBy("service.name")
            .getRawMany();

        const result = allServices.map(s => {
            const found = query.find(q => q.id_service === s.id);
            return {
                id_service: s.id,
                service_name: s.name,
                waiting_count: found ? Number(found.waiting_count) : 0
            };
        });

        return result;
    }
}