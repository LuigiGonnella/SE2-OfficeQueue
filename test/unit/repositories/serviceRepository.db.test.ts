/// <reference types="jest" />

import { ServiceRepository } from '../../../src/repositories/serviceRepository';
import {
    initializeTestDataSource,
    closeTestDataSource,
    TestDataSource,
} from '../../utils';

import { ServiceDAO } from '../../../src/models/dao/serviceDAO';
import { NotFoundError } from '../../../src/models/errors/NotFoundError';
import { ConflictError } from '../../../src/models/errors/ConflictError';
import AppError from '../../../src/models/errors/AppError';

describe('ServiceRepository', () => {
    let serviceRepository: ServiceRepository;

    beforeAll(async () => {
        await initializeTestDataSource();
        serviceRepository = new ServiceRepository();
    });

    afterAll(async () => {
        await closeTestDataSource();
    });

    beforeEach(async () => {
        jest.resetModules();
        
        // Clear all tables
        await TestDataSource.getRepository(ServiceDAO).clear();
    });

    describe('getAllServices', () => {
        it('should return empty array when no services exist', async () => {
            const services = await serviceRepository.getAllServices();
            expect(services).toEqual([]);
        });

        it('should return all services when services exist', async () => {
            // Create test services
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            await serviceRepo.save([
                { 
                    id: 1, 
                    name: 'Service 1', 
                    description: 'Test service 1',
                    average_service_time: 5 
                },
                { 
                    id: 2, 
                    name: 'Service 2', 
                    description: 'Test service 2',
                    average_service_time: 10 
                }
            ]);

            const services = await serviceRepository.getAllServices();
            expect(services).toHaveLength(2);
            expect(services[0].name).toBe('Service 1');
            expect(services[1].name).toBe('Service 2');
        });
    });

    describe('getServiceById', () => {
        it('should return service when found', async () => {
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            await serviceRepo.save({
                id: 1,
                name: 'Test Service',
                description: 'Test description',
                average_service_time: 5
            });

            const service = await serviceRepository.getServiceById(1);
            expect(service.id).toBe(1);
            expect(service.name).toBe('Test Service');
        });

        it('should throw NotFoundError when service not found', async () => {
            await expect(serviceRepository.getServiceById(999))
                .rejects.toThrow('Service not found');
        });
    });

    describe('getServiceByName', () => {
        it('should return service when found', async () => {
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            await serviceRepo.save({
                id: 1,
                name: 'Test Service',
                description: 'Test description',
                average_service_time: 5
            });

            const service = await serviceRepository.getServiceByName('Test Service');
            expect(service.id).toBe(1);
            expect(service.name).toBe('Test Service');
        });

        it('should throw NotFoundError when service not found', async () => {
            await expect(serviceRepository.getServiceByName('Non-existent Service'))
                .rejects.toThrow('Service not found with name Non-existent Service');
        });
    });

    describe('createService', () => {
        it('should create service successfully with valid data', async () => {
            await serviceRepository.createService('New Service', 5, 'Test description');
            
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            const service = await serviceRepo.findOne({ where: { name: 'New Service' } });
            
            expect(service).toBeTruthy();
            expect(service?.name).toBe('New Service');
            expect(service?.average_service_time).toBe(5);
            expect(service?.description).toBe('Test description');
        });

        it('should create service successfully without description', async () => {
            await serviceRepository.createService('New Service', 10);
            
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            const service = await serviceRepo.findOne({ where: { name: 'New Service' } });
            
            expect(service).toBeTruthy();
            expect(service?.name).toBe('New Service');
            expect(service?.average_service_time).toBe(10);
            expect(service?.description).toBeNull();
        });

        it('should trim whitespace from service name', async () => {
            await serviceRepository.createService('  Trimmed Service  ', 5);
            
            const serviceRepo = TestDataSource.getRepository(ServiceDAO);
            const service = await serviceRepo.findOne({ where: { name: 'Trimmed Service' } });
            
            expect(service).toBeTruthy();
            expect(service?.name).toBe('Trimmed Service');
        });

        it('should throw AppError when name is empty', async () => {
            await expect(serviceRepository.createService('', 5))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when name is only whitespace', async () => {
            await expect(serviceRepository.createService('   ', 5))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when name is null', async () => {
            await expect(serviceRepository.createService(null as any, 5))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when average_service_time is zero', async () => {
            await expect(serviceRepository.createService('Test Service', 0))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when average_service_time is negative', async () => {
            await expect(serviceRepository.createService('Test Service', -5))
                .rejects.toThrow(AppError);
        });

        it('should throw ConflictError when service name already exists', async () => {
            // Create first service
            await serviceRepository.createService('Duplicate Service', 5);

            // Try to create another with same name
            await expect(serviceRepository.createService('Duplicate Service', 10))
                .rejects.toThrow('Service already exists with name Duplicate Service');
        });

        it('should throw ConflictError when service name already exists (case sensitive)', async () => {
            // Create first service
            await serviceRepository.createService('Test Service', 5);

            // Try to create another with same name (exact match)
            await expect(serviceRepository.createService('Test Service', 10))
                .rejects.toThrow('Service already exists with name Test Service');
        });

        it('should allow creating services with different names', async () => {
            await serviceRepository.createService('Service A', 5);
            await serviceRepository.createService('Service B', 10);

            const services = await serviceRepository.getAllServices();
            expect(services).toHaveLength(2);
        });
    });

    describe('deleteService', () => {
        it('should delete service successfully when service exists', async () => {
            // Create a service first
            await serviceRepository.createService('Service to Delete', 5);
            
            // Verify it exists
            let services = await serviceRepository.getAllServices();
            expect(services).toHaveLength(1);

            // Delete the service
            await serviceRepository.deleteService('Service to Delete');

            // Verify it's deleted
            services = await serviceRepository.getAllServices();
            expect(services).toHaveLength(0);
        });

        it('should throw NotFoundError when trying to delete non-existent service', async () => {
            await expect(serviceRepository.deleteService('Non-existent Service'))
                .rejects.toThrow('Service not found with name Non-existent Service');
        });

        it('should only delete the specified service', async () => {
            // Create multiple services
            await serviceRepository.createService('Service A', 5);
            await serviceRepository.createService('Service B', 10);
            await serviceRepository.createService('Service C', 15);

            // Delete one service
            await serviceRepository.deleteService('Service B');

            // Verify only the specified service was deleted
            const remainingServices = await serviceRepository.getAllServices();
            expect(remainingServices).toHaveLength(2);
            
            const serviceNames = remainingServices.map(s => s.name);
            expect(serviceNames).toContain('Service A');
            expect(serviceNames).toContain('Service C');
            expect(serviceNames).not.toContain('Service B');
        });
    });
});