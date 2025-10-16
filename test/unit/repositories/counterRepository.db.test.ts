/// <reference types="jest" />

import { CounterRepository } from '../../../src/repositories/counterRepository';
import {
    initializeTestDataSource,
    closeTestDataSource,
    TestDataSource,
} from '../../utils';

import { CounterDAO } from '../../../src/models/dao/counterDAO';
import { ServiceDAO } from '../../../src/models/dao/serviceDAO';
import { NotFoundError } from '../../../src/models/errors/NotFoundError';

describe('CounterRepository', () => {
    let counterRepository: CounterRepository;
    let testService1: ServiceDAO;
    let testService2: ServiceDAO;

    beforeAll(async () => {
        await initializeTestDataSource();
        counterRepository = new CounterRepository();
    });

    afterAll(async () => {
        await closeTestDataSource();
    });

    beforeEach(async () => {
        jest.resetModules();
        
        // Clear all tables
        await TestDataSource.getRepository(CounterDAO).clear();
        await TestDataSource.getRepository(ServiceDAO).clear();

        // Create test services
        const serviceRepo = TestDataSource.getRepository(ServiceDAO);
        testService1 = await serviceRepo.save({
            id: 1,
            name: 'Test Service 1',
            description: 'First test service',
            average_service_time: 5
        });

        testService2 = await serviceRepo.save({
            id: 2,
            name: 'Test Service 2',
            description: 'Second test service',
            average_service_time: 10
        });
    });

    describe('getAllCounters', () => {
        it('should return empty array when no counters exist', async () => {
            const counters = await counterRepository.getAllCounters();
            expect(counters).toEqual([]);
        });

        it('should return all counters with their services', async () => {
            // Create test counters
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            await counterRepo.save([
                {
                    id: 1,
                    services: [testService1],
                    queues: []
                },
                {
                    id: 2,
                    services: [testService1, testService2],
                    queues: []
                }
            ]);

            const counters = await counterRepository.getAllCounters();
            expect(counters).toHaveLength(2);
            expect(counters[0].services).toBeDefined();
            expect(counters[1].services).toBeDefined();
            expect(counters[1].services).toHaveLength(2);
        });
    });

    describe('getCounterById', () => {
        it('should return counter with services when found', async () => {
            // Create test counter
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            await counterRepo.save({
                id: 1,
                services: [testService1, testService2],
                queues: []
            });

            const counter = await counterRepository.getCounterById(1);
            expect(counter).toBeTruthy();
            expect(counter?.id).toBe(1);
            expect(counter?.services).toHaveLength(2);
        });

        it('should return null when counter not found', async () => {
            const counter = await counterRepository.getCounterById(999);
            expect(counter).toBeNull();
        });
    });

    describe('createCounter', () => {
        it('should create counter successfully with single service', async () => {
            const counter = await counterRepository.createCounter(1, [1]);
            
            expect(counter.id).toBe(1);
            expect(counter.services).toHaveLength(1);
            expect(counter.services[0].id).toBe(1);
            expect(counter.services[0].name).toBe('Test Service 1');
        });

        it('should create counter successfully with multiple services', async () => {
            const counter = await counterRepository.createCounter(2, [1, 2]);
            
            expect(counter.id).toBe(2);
            expect(counter.services).toHaveLength(2);
            
            const serviceIds = counter.services.map((s: ServiceDAO) => s.id);
            expect(serviceIds).toContain(1);
            expect(serviceIds).toContain(2);
        });

        it('should create counter successfully with no services', async () => {
            const counter = await counterRepository.createCounter(3, []);
            
            expect(counter.id).toBe(3);
            expect(counter.services).toHaveLength(0);
        });

        it('should throw NotFoundError when service does not exist', async () => {
            await expect(counterRepository.createCounter(1, [999]))
                .rejects.toThrow('Service with id 999 not found');
        });

        it('should throw NotFoundError when one of multiple services does not exist', async () => {
            await expect(counterRepository.createCounter(1, [1, 999]))
                .rejects.toThrow('Service with id 999 not found');
        });

        it('should persist counter in database', async () => {
            await counterRepository.createCounter(10, [1]);
            
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            const savedCounter = await counterRepo.findOne({
                where: { id: 10 },
                relations: ['services']
            });
            
            expect(savedCounter).toBeTruthy();
            expect(savedCounter?.id).toBe(10);
            expect(savedCounter?.services).toHaveLength(1);
        });
    });

    describe('updateCounter', () => {
        beforeEach(async () => {
            // Create a counter to update
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            await counterRepo.save({
                id: 1,
                services: [testService1],
                queues: []
            });
        });

        it('should update counter services successfully', async () => {
            const updatedCounter = await counterRepository.updateCounter(1, [2]);
            
            expect(updatedCounter.id).toBe(1);
            expect(updatedCounter.services).toHaveLength(1);
            expect(updatedCounter.services[0].id).toBe(2);
            expect(updatedCounter.services[0].name).toBe('Test Service 2');
        });

        it('should update counter with multiple services', async () => {
            const updatedCounter = await counterRepository.updateCounter(1, [1, 2]);
            
            expect(updatedCounter.services).toHaveLength(2);
            const serviceIds = updatedCounter.services.map((s: ServiceDAO) => s.id);
            expect(serviceIds).toContain(1);
            expect(serviceIds).toContain(2);
        });

        it('should update counter to have no services', async () => {
            const updatedCounter = await counterRepository.updateCounter(1, []);
            
            expect(updatedCounter.services).toHaveLength(0);
        });

        it('should throw NotFoundError when counter does not exist', async () => {
            await expect(counterRepository.updateCounter(999, [1]))
                .rejects.toThrow('Counter with code 999 not found');
        });

        it('should throw NotFoundError when service does not exist', async () => {
            await expect(counterRepository.updateCounter(1, [999]))
                .rejects.toThrow('Service with id 999 not found');
        });

        it('should persist changes in database', async () => {
            await counterRepository.updateCounter(1, [1, 2]);
            
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            const savedCounter = await counterRepo.findOne({
                where: { id: 1 },
                relations: ['services']
            });
            
            expect(savedCounter?.services).toHaveLength(2);
        });
    });

    describe('getAllServicesByCounter', () => {
        beforeEach(async () => {
            // Create counters with different services
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            await counterRepo.save([
                {
                    id: 1,
                    services: [testService1, testService2],
                    queues: []
                },
                {
                    id: 2,
                    services: [testService1],
                    queues: []
                }
            ]);
        });

        it('should return all services for existing counter', async () => {
            const services = await counterRepository.getAllServicesByCounter(1);
            
            expect(services).toHaveLength(2);
            const serviceIds = services.map((s: ServiceDAO) => s.id);
            expect(serviceIds).toContain(1);
            expect(serviceIds).toContain(2);
        });

        it('should return single service for counter with one service', async () => {
            const services = await counterRepository.getAllServicesByCounter(2);
            
            expect(services).toHaveLength(1);
            expect(services[0].id).toBe(1);
            expect(services[0].name).toBe('Test Service 1');
        });

        it('should throw NotFoundError when counter does not exist', async () => {
            await expect(counterRepository.getAllServicesByCounter(999))
                .rejects.toThrow('Counter with code 999 not found');
        });

        it('should return empty array for counter with no services', async () => {
            // Create counter with no services
            const counterRepo = TestDataSource.getRepository(CounterDAO);
            await counterRepo.save({
                id: 3,
                services: [],
                queues: []
            });

            const services = await counterRepository.getAllServicesByCounter(3);
            expect(services).toEqual([]);
        });
    });
});