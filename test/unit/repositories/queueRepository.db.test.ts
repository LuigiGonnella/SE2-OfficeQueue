/// <reference types="jest" />

import { QueueRepository } from '../../../src/repositories/queueRepository';
import {
    initializeTestDataSource,
    closeTestDataSource,
    TestDataSource,
} from '../../utils';

import { QueueDAO } from '../../../src/models/dao/queueDAO';
import { TicketDAO } from '../../../src/models/dao/ticketDAO';
import { ServiceDAO } from '../../../src/models/dao/serviceDAO';
import { CustomerDAO } from '../../../src/models/dao/customerDAO';
import { CounterDAO } from '../../../src/models/dao/counterDAO';

describe('QueueRepository', () => {
    let queueRepository: QueueRepository;
    let testCustomer: CustomerDAO;
    let testService: ServiceDAO;
    let testCounter: CounterDAO;
    let testTicket: TicketDAO;

    beforeAll(async () => {
        await initializeTestDataSource();
        queueRepository = new QueueRepository();
    });

    afterAll(async () => {
        await closeTestDataSource();
    });

    beforeEach(async () => {
        jest.resetModules();
        
        // Clear all tables in correct order (respecting foreign keys)
        await TestDataSource.getRepository(QueueDAO).clear();
        await TestDataSource.getRepository(TicketDAO).clear();
        await TestDataSource.getRepository(CounterDAO).clear();
        await TestDataSource.getRepository(ServiceDAO).clear();
        await TestDataSource.getRepository(CustomerDAO).clear();

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

        const ticketRepo = TestDataSource.getRepository(TicketDAO);
        testTicket = await ticketRepo.save({
            ticket_code: 100,
            customer: testCustomer,
            service: testService
        });

        const counterRepo = TestDataSource.getRepository(CounterDAO);
        testCounter = await counterRepo.save({
            id: 1,
            counter_code: 'C001',
            services: [testService],
            queues: []
        });
    });

    describe('getAllQueueEntries', () => {
        it('should return empty array when no queue entries exist', async () => {
            const queueEntries = await queueRepository.getAllQueueEntries();
            expect(queueEntries).toEqual([]);
        });

        it('should return all queue entries with ticket relations', async () => {
            // Create additional tickets for the test
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket2 = await ticketRepo.save({
                ticket_code: 101,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            await queueRepo.save([
                { 
                    ticket: testTicket, 
                    served: false, 
                    timestamp: new Date() 
                },
                { 
                    ticket: ticket2, 
                    served: true, 
                    timestamp: new Date(),
                    served_at: new Date()
                }
            ]);

            const queueEntries = await queueRepository.getAllQueueEntries();
            expect(queueEntries).toHaveLength(2);
            expect(queueEntries[0].ticket).toBeDefined();
            expect(queueEntries[1].ticket).toBeDefined();
        });
    });

    describe('getCurrentQueue', () => {
        it('should return empty array when no unserved entries exist', async () => {
            const currentQueue = await queueRepository.getCurrentQueue();
            expect(currentQueue).toEqual([]);
        });

        it('should return only unserved entries from today', async () => {
            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 101,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 102,
                customer: testCustomer,
                service: testService
            });
            const ticket3 = await ticketRepo.save({
                ticket_code: 103,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            await queueRepo.save([
                { 
                    ticket: ticket1, 
                    served: false, 
                    timestamp: today 
                },
                { 
                    ticket: ticket2, 
                    served: true, 
                    timestamp: today,
                    served_at: new Date()
                },
                { 
                    ticket: ticket3, 
                    served: false, 
                    timestamp: yesterday 
                }
            ]);

            const currentQueue = await queueRepository.getCurrentQueue();
            expect(currentQueue).toHaveLength(1);
            expect(currentQueue![0].served).toBe(false);
            expect(currentQueue![0].ticket.ticket_code).toBe(101);
        });

        it('should return entries ordered by timestamp ASC', async () => {
            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 201,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 202,
                customer: testCustomer,
                service: testService
            });
            const ticket3 = await ticketRepo.save({
                ticket_code: 203,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const time1 = new Date();
            const time2 = new Date(time1.getTime() + 1000); // 1 second later
            const time3 = new Date(time1.getTime() + 2000); // 2 seconds later

            await queueRepo.save([
                { ticket: ticket3, served: false, timestamp: time3 },
                { ticket: ticket1, served: false, timestamp: time1 },
                { ticket: ticket2, served: false, timestamp: time2 }
            ]);

            const currentQueue = await queueRepository.getCurrentQueue();
            expect(currentQueue).toHaveLength(3);
            expect(currentQueue![0].ticket.ticket_code).toBe(201); // earliest timestamp
            expect(currentQueue![1].ticket.ticket_code).toBe(202);
            expect(currentQueue![2].ticket.ticket_code).toBe(203); // latest timestamp
        });
    });

    describe('getCurrentQueueByService', () => {
        it('should return empty array when no unserved entries exist for service', async () => {
            const serviceQueue = await queueRepository.getCurrentQueueByService(1);
            expect(serviceQueue).toEqual([]);
        });

        it('should return only unserved entries for specific service from today', async () => {
            // Create another service
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            const testService2 = await serviceRepo.save({
                id: 2,
                name: 'Test Service 2',
                description: 'Another test service',
                average_service_time: 3
            });

            // Create tickets for both services
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 301,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 302,
                customer: testCustomer,
                service: testService2
            });
            const ticket3 = await ticketRepo.save({
                ticket_code: 303,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            await queueRepo.save([
                { ticket: ticket1, served: false, timestamp: new Date() },
                { ticket: ticket2, served: false, timestamp: new Date() },
                { ticket: ticket3, served: true, timestamp: new Date(), served_at: new Date() }
            ]);

            const serviceQueue = await queueRepository.getCurrentQueueByService(1);
            expect(serviceQueue).toHaveLength(1);
            expect(serviceQueue![0].ticket.service.id).toBe(1);
            expect(serviceQueue![0].served).toBe(false);
        });
    });

    describe('getLastFiveServed', () => {
        it('should return empty array when no served entries exist', async () => {
            const lastServed = await queueRepository.getLastFiveServed();
            expect(lastServed).toEqual([]);
        });

        it('should return only served entries ordered by closed_at DESC', async () => {
            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 401,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 402,
                customer: testCustomer,
                service: testService
            });
            const ticket3 = await ticketRepo.save({
                ticket_code: 403,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const time1 = new Date();
            const time2 = new Date(time1.getTime() + 1000);
            const time3 = new Date(time1.getTime() + 2000);

            await queueRepo.save([
                { 
                    ticket: ticket1, 
                    served: true, 
                    timestamp: time1,
                    served_at: time1,
                    closed_at: time1
                },
                { 
                    ticket: ticket2, 
                    served: false, 
                    timestamp: time2 
                },
                { 
                    ticket: ticket3, 
                    served: true, 
                    timestamp: time2,
                    served_at: time2,
                    closed_at: time3 // latest closed
                }
            ]);

            const lastServed = await queueRepository.getLastFiveServed();
            expect(lastServed).toHaveLength(2);
            expect(lastServed[0].ticket.ticket_code).toBe(403); // latest closed_at first
            expect(lastServed[1].ticket.ticket_code).toBe(401);
        });

        it('should limit results to maximum 5 entries', async () => {
            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const tickets = [];
            for (let i = 1; i <= 7; i++) {
                const ticket = await ticketRepo.save({
                    ticket_code: 500 + i,
                    customer: testCustomer,
                    service: testService
                });
                tickets.push(ticket);
            }

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const entries = [];
            
            for (let i = 0; i < 7; i++) {
                const time = new Date(Date.now() + (i + 1) * 1000);
                entries.push({
                    ticket: tickets[i],
                    served: true,
                    timestamp: time,
                    served_at: time,
                    closed_at: time
                });
            }
            
            await queueRepo.save(entries);

            const lastServed = await queueRepository.getLastFiveServed();
            expect(lastServed).toHaveLength(5);
            // Should get the 5 most recent ticket codes (507, 506, 505, 504, 503)
            expect(lastServed[0].ticket.ticket_code).toBe(507);
            expect(lastServed[4].ticket.ticket_code).toBe(503);
        });
    });

    describe('getServedByCounterToday', () => {
        it('should return empty array when no entries served by counter today', async () => {
            const servedToday = await queueRepository.getServedByCounterToday(1);
            expect(servedToday).toEqual([]);
        });

        it('should return only entries served by specific counter today', async () => {
            // Create another counter
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            const testCounter2 = await counterRepo.save({
                id: 2,
                counter_code: 'C002',
                services: [testService],
                queues: []
            });

            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 601,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 602,
                customer: testCustomer,
                service: testService
            });
            const ticket3 = await ticketRepo.save({
                ticket_code: 603,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            await queueRepo.save([
                { 
                    ticket: ticket1, 
                    served: true, 
                    counter: testCounter,
                    timestamp: today,
                    served_at: today,
                    closed_at: today
                },
                { 
                    ticket: ticket2, 
                    served: true, 
                    counter: testCounter2,
                    timestamp: today,
                    served_at: today,
                    closed_at: today
                },
                { 
                    ticket: ticket3, 
                    served: true, 
                    counter: testCounter,
                    timestamp: yesterday,
                    served_at: yesterday,
                    closed_at: yesterday
                }
            ]);

            const servedToday = await queueRepository.getServedByCounterToday(1);
            expect(servedToday).toHaveLength(1);
            expect(servedToday[0].ticket.ticket_code).toBe(601);
            expect(servedToday[0].counter?.id).toBe(1);
        });
    });

    describe('getAllQueueEntriesByService', () => {
        it('should return empty array when no unserved entries exist for service', async () => {
            const serviceEntries = await queueRepository.getAllQueueEntriesByService(1);
            expect(serviceEntries).toEqual([]);
        });

        it('should return only unserved entries for specific service', async () => {
            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 801,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 802,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            
            await queueRepo.save([
                { ticket: ticket1, served: false, timestamp: new Date() },
                { ticket: ticket2, served: true, timestamp: new Date(), served_at: new Date() }
            ]);

            const serviceEntries = await queueRepository.getAllQueueEntriesByService(1);
            expect(serviceEntries).toHaveLength(1);
            expect(serviceEntries[0].served).toBe(false);
            expect(serviceEntries[0].ticket.service.id).toBe(1);
        });
    });

    describe('serveQueueEntry', () => {
        it('should update queue entry to served status', async () => {
            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const queueEntry = await queueRepo.save({
                id: 1,
                ticket: testTicket,
                served: false,
                timestamp: new Date()
            });

            await queueRepository.serveQueueEntry(1, 1);

            const updatedEntry = await queueRepo.findOne({ 
                where: { id: 1 },
                relations: ['counter']
            });
            
            expect(updatedEntry?.served).toBe(true);
            expect(updatedEntry?.served_at).toBeDefined();
            expect(updatedEntry?.counter?.id).toBe(1);
        });

        it('should not affect other queue entries', async () => {
            // Create multiple tickets
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket1 = await ticketRepo.save({
                ticket_code: 701,
                customer: testCustomer,
                service: testService
            });
            const ticket2 = await ticketRepo.save({
                ticket_code: 702,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            const entry1 = await queueRepo.save({ ticket: ticket1, served: false, timestamp: new Date() });
            const entry2 = await queueRepo.save({ ticket: ticket2, served: false, timestamp: new Date() });

            await queueRepository.serveQueueEntry(entry1.id, 1);

            const updatedEntry1 = await queueRepo.findOne({ where: { id: entry1.id } });
            const updatedEntry2 = await queueRepo.findOne({ where: { id: entry2.id } });
            
            expect(updatedEntry1?.served).toBe(true);
            expect(updatedEntry2?.served).toBe(false);
        });
    });

    describe('closeQueueEntry', () => {
        it('should update queue entry with closed_at timestamp', async () => {
            const queueRepo = TestDataSource.getRepository(QueueDAO);
            await queueRepo.save({
                id: 1,
                ticket: testTicket,
                served: true,
                timestamp: new Date(),
                served_at: new Date()
            });

            const beforeClose = new Date();
            await queueRepository.closeQueueEntry(100); // ticket_code
            const afterClose = new Date();

            const updatedEntry = await queueRepo.findOne({ where: { id: 1 } });
            
            expect(updatedEntry?.closed_at).toBeDefined();
            expect(updatedEntry?.closed_at!.getTime()).toBeGreaterThanOrEqual(beforeClose.getTime());
            expect(updatedEntry?.closed_at!.getTime()).toBeLessThanOrEqual(afterClose.getTime());
        });

        it('should only update the entry with matching ticket code', async () => {
            // Create another ticket
            const ticketRepo = TestDataSource.getRepository(TicketDAO);
            const ticket2 = await ticketRepo.save({
                ticket_code: 200,
                customer: testCustomer,
                service: testService
            });

            const queueRepo = TestDataSource.getRepository(QueueDAO);
            await queueRepo.save([
                { id: 1, ticket: testTicket, served: true, timestamp: new Date(), served_at: new Date() },
                { id: 2, ticket: ticket2, served: true, timestamp: new Date(), served_at: new Date() }
            ]);

            await queueRepository.closeQueueEntry(100); // close only first ticket

            const entry1 = await queueRepo.findOne({ where: { id: 1 } });
            const entry2 = await queueRepo.findOne({ where: { id: 2 } });
            
            expect(entry1?.closed_at).toBeDefined();
            expect(entry2?.closed_at).toBeNull();
        });
    });
});