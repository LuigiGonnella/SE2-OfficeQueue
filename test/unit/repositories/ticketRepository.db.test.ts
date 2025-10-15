import { TicketRepository } from '../../../src/repositories/ticketRepository';
import {
    initializeTestDataSource,
    closeTestDataSource,
    TestDataSource,
} from '../../utils';

import { TicketDAO } from '../../../src/models/dao/ticketDAO';
import { CustomerDAO } from '../../../src/models/dao/customerDAO';
import { ServiceDAO } from '../../../src/models/dao/serviceDAO';
import { QueueDAO } from '../../../src/models/dao/queueDAO';
import { NotFoundError } from '../../../src/models/errors/NotFoundError';
import { BadRequestError } from '../../../src/models/errors/BadRequestError';
import { ConflictError } from '../../../src/models/errors/ConflictError';

describe('TicketRepository', () => {
    let ticketRepository: TicketRepository;
    let testCustomer: CustomerDAO;
    let testService: ServiceDAO;

    beforeAll(async () => {
        await initializeTestDataSource();
        ticketRepository = new TicketRepository();
    });

    afterAll(async () => {
        await closeTestDataSource();
    });

    beforeEach(async () => {
        jest.resetModules();
        
        // Clear all tables
        await TestDataSource.getRepository(QueueDAO).clear();
        await TestDataSource.getRepository(TicketDAO).clear();
        await TestDataSource.getRepository(CustomerDAO).clear();
        await TestDataSource.getRepository(ServiceDAO).clear();

        // Create test data
        const customerRepo = TestDataSource.getRepository(CustomerDAO);
        testCustomer = await customerRepo.save({
            customer_id: 1,
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '1234567890'
        });

        const serviceRepo = TestDataSource.getRepository(ServiceDAO);
        testService = await serviceRepo.save({
            id: 1,
            name: 'Test Service',
            description: 'Test service description',
            average_service_time: 5
        });
    });

    describe('getAllTickets', () => {
        it('should return empty array when no tickets exist', async () => {
            const tickets = await ticketRepository.getAllTickets();
            expect(tickets).toEqual([]);
        });

        it('should return all tickets when tickets exist', async () => {
            // Create test tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            await ticketRepo.save([
                { ticket_code: 1, customer: testCustomer, service: testService },
                { ticket_code: 2, customer: testCustomer, service: testService }
            ]);

            const tickets = await ticketRepository.getAllTickets();
            expect(tickets).toHaveLength(2);
            expect(tickets[0].ticket_code).toBe(1);
            expect(tickets[1].ticket_code).toBe(2);
        });
    });

    describe('getTicketByCode', () => {
        it('should return ticket when found', async () => {
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            await ticketRepo.save({
                ticket_code: 123,
                customer: testCustomer,
                service: testService
            });

            const ticket = await ticketRepository.getTicketByCode(123);
            expect(ticket.ticket_code).toBe(123);
        });

        it('should throw NotFoundError when ticket not found', async () => {
            await expect(ticketRepository.getTicketByCode(999))
                .rejects.toThrow('Ticket with code 999 not found');
        });
    });

    describe('createTicket', () => {
        it('should create ticket successfully with valid data', async () => {
            const ticket = await ticketRepository.createTicket(100, 1, 1);
            
            expect(ticket.ticket_code).toBe(100);
            expect(ticket.customer.customer_id).toBe(1);
            expect(ticket.service.id).toBe(1);

            // Verify queue entry was created
            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const queueEntry = await queueRepo.findOne({ 
                where: { ticket: { ticket_code: 100 } },
                relations: ['ticket']
            });
            expect(queueEntry).toBeTruthy();
            expect(queueEntry?.ticket.ticket_code).toBe(100);
        });

        it('should throw BadRequestError when ticket_code is missing', async () => {
            await expect(ticketRepository.createTicket(null as any, 1, 1))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw BadRequestError when customer_id is missing', async () => {
            await expect(ticketRepository.createTicket(100, null as any, 1))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw BadRequestError when id_service is missing', async () => {
            await expect(ticketRepository.createTicket(100, 1, null as any))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw ConflictError when ticket_code already exists', async () => {
            // Create first ticket
            await ticketRepository.createTicket(100, 1, 1);

            // Try to create another with same code
            await expect(ticketRepository.createTicket(100, 1, 1))
                .rejects.toThrow('Ticket with code 100 already exists');
        });

        it('should throw NotFoundError when customer does not exist', async () => {
            await expect(ticketRepository.createTicket(100, 999, 1))
                .rejects.toThrow('Customer with id 999 not found');
        });

        it('should throw NotFoundError when service does not exist', async () => {
            await expect(ticketRepository.createTicket(100, 1, 999))
                .rejects.toThrow('Service with id 999 not found');
        });
    });

    describe('getTicketByTicketCode', () => {
        it('should return ticket when found', async () => {
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            await ticketRepo.save({
                ticket_code: 200,
                customer: testCustomer,
                service: testService
            });

            const ticket = await ticketRepository.getTicketByTicketCode(200);
            expect(ticket.ticket_code).toBe(200);
        });

        it('should throw NotFoundError when ticket not found', async () => {
            await expect(ticketRepository.getTicketByTicketCode(999))
                .rejects.toThrow('Ticket with code 999 not found');
        });
    });

    describe('getTicketsByServiceCode', () => {
        it('should return tickets for existing service', async () => {
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            await ticketRepo.save([
                { ticket_code: 1, customer: testCustomer, service: testService },
                { ticket_code: 2, customer: testCustomer, service: testService }
            ]);

            const tickets = await ticketRepository.getTicketsByServiceCode(1);
            expect(tickets).toHaveLength(2);
            expect(tickets[0].service.id).toBe(1);
            expect(tickets[1].service.id).toBe(1);
        });

        it('should return empty array for service with no tickets', async () => {
            const tickets = await ticketRepository.getTicketsByServiceCode(1);
            expect(tickets).toEqual([]);
        });

        it('should throw NotFoundError for non-existent service', async () => {
            await expect(ticketRepository.getTicketsByServiceCode(999))
                .rejects.toThrow('Service with code 999 not found');
        });
    });

    describe('getQueueLengthsByService', () => {
        it('should throw NotFoundError when no services exist', async () => {
            // Clear all services
            await TestDataSource.getRepository(ServiceDAO).clear();
            
            await expect(ticketRepository.getQueueLengthsByService())
                .rejects.toThrow('No services found');
        });

    


    });
});