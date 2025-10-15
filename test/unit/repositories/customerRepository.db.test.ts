/// <reference types="jest" />

import { CustomerRepository } from '../../../src/repositories/customerRepository';
import {
    initializeTestDataSource,
    closeTestDataSource,
    TestDataSource,
} from '../../utils';

import { CustomerDAO } from '../../../src/models/dao/customerDAO';
import { ConflictError } from '../../../src/models/errors/ConflictError';
import AppError from '../../../src/models/errors/AppError';

describe('CustomerRepository', () => {
    let customerRepository: CustomerRepository;

    beforeAll(async () => {
        await initializeTestDataSource();
        customerRepository = new CustomerRepository();
    });

    afterAll(async () => {
        await closeTestDataSource();
    });

    beforeEach(async () => {
        jest.resetModules();
        
        // Clear all tables
        await TestDataSource.getRepository(CustomerDAO).clear();
    });

    describe('getAllCustomers', () => {
        it('should return empty array when no customers exist', async () => {
            const customers = await customerRepository.getAllCustomers();
            expect(customers).toEqual([]);
        });

        it('should return all customers when customers exist', async () => {
            // Create test customers
            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            await customerRepo.save([
                {
                    customer_id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    phoneNumber: '1234567890'
                },
                {
                    customer_id: 2,
                    firstName: 'Jane',
                    lastName: 'Smith',
                    phoneNumber: '0987654321'
                }
            ]);

            const customers = await customerRepository.getAllCustomers();
            expect(customers).toHaveLength(2);
            expect(customers[0].firstName).toBe('John');
            expect(customers[0].lastName).toBe('Doe');
            expect(customers[1].firstName).toBe('Jane');
            expect(customers[1].lastName).toBe('Smith');
        });
    });

    describe('createCustomer', () => {
        it('should create customer successfully with valid data including phoneNumber', async () => {
            await customerRepository.createCustomer('John', 'Doe', '1234567890');
            
            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customers = await customerRepo.find();
            
            expect(customers).toHaveLength(1);
            expect(customers[0].firstName).toBe('John');
            expect(customers[0].lastName).toBe('Doe');
            expect(customers[0].phoneNumber).toBe('1234567890');
        });

        it('should create customer successfully without phoneNumber', async () => {
            await customerRepository.createCustomer('Jane', 'Smith');
            
            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customers = await customerRepo.find();
            
            expect(customers).toHaveLength(1);
            expect(customers[0].firstName).toBe('Jane');
            expect(customers[0].lastName).toBe('Smith');
            expect(customers[0].phoneNumber).toBeNull();
        });

        it('should trim whitespace from firstName and lastName', async () => {
            await customerRepository.createCustomer('  John  ', '  Doe  ', '1234567890');
            
            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customers = await customerRepo.find();
            
            expect(customers).toHaveLength(1);
            expect(customers[0].firstName).toBe('John');
            expect(customers[0].lastName).toBe('Doe');
        });

        it('should throw AppError when firstName is empty', async () => {
            await expect(customerRepository.createCustomer('', 'Doe'))
                .rejects.toThrow(AppError);
            
            await expect(customerRepository.createCustomer('', 'Doe'))
                .rejects.toThrow('Invalid input data');
        });

        it('should throw AppError when firstName is only whitespace', async () => {
            await expect(customerRepository.createCustomer('   ', 'Doe'))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when firstName is null', async () => {
            await expect(customerRepository.createCustomer(null as any, 'Doe'))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when lastName is empty', async () => {
            await expect(customerRepository.createCustomer('John', ''))
                .rejects.toThrow(AppError);
            
            await expect(customerRepository.createCustomer('John', ''))
                .rejects.toThrow('Invalid input data');
        });

        it('should throw AppError when lastName is only whitespace', async () => {
            await expect(customerRepository.createCustomer('John', '   '))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when lastName is null', async () => {
            await expect(customerRepository.createCustomer('John', null as any))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError when both firstName and lastName are empty', async () => {
            await expect(customerRepository.createCustomer('', ''))
                .rejects.toThrow(AppError);
        });

        it('should throw ConflictError when customer with same firstName and lastName already exists', async () => {
            // Create first customer
            await customerRepository.createCustomer('John', 'Doe', '1234567890');

            // Try to create another with same name
            await expect(customerRepository.createCustomer('John', 'Doe', '0987654321'))
                .rejects.toThrow('Customer already exists with name John Doe');
        });

        it('should throw ConflictError when customer with same firstName and lastName exists (after trimming)', async () => {
            // Create first customer
            await customerRepository.createCustomer('John', 'Doe');

            // Try to create another with same name but with whitespace
            await expect(customerRepository.createCustomer('  John  ', '  Doe  '))
                .rejects.toThrow('Customer already exists with name John Doe');
        });

        it('should allow customers with same firstName but different lastName', async () => {
            await customerRepository.createCustomer('John', 'Doe');
            await customerRepository.createCustomer('John', 'Smith');

            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customers = await customerRepo.find();
            
            expect(customers).toHaveLength(2);
            expect(customers.find(c => c.lastName === 'Doe')).toBeDefined();
            expect(customers.find(c => c.lastName === 'Smith')).toBeDefined();
        });

        it('should allow customers with different firstName but same lastName', async () => {
            await customerRepository.createCustomer('John', 'Doe');
            await customerRepository.createCustomer('Jane', 'Doe');

            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customers = await customerRepo.find();
            
            expect(customers).toHaveLength(2);
            expect(customers.find(c => c.firstName === 'John')).toBeDefined();
            expect(customers.find(c => c.firstName === 'Jane')).toBeDefined();
        });

        it('should allow customers with same name but different phoneNumbers to be distinct', async () => {
            // First customer
            await customerRepository.createCustomer('John', 'Doe', '1111111111');

            // This should still fail because the conflict is based on firstName + lastName only
            await expect(customerRepository.createCustomer('John', 'Doe', '2222222222'))
                .rejects.toThrow('Customer already exists with name John Doe');
        });

        it('should handle phoneNumber as undefined when not provided', async () => {
            await customerRepository.createCustomer('Test', 'User');
            
            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customer = await customerRepo.findOne({ 
                where: { firstName: 'Test', lastName: 'User' } 
            });
            
            expect(customer).toBeTruthy();
            expect(customer?.phoneNumber).toBeNull();
        });

        it('should handle phoneNumber as empty string', async () => {
            await customerRepository.createCustomer('Test', 'User', '');
            
            const customerRepo = TestDataSource.getRepository(CustomerDAO);
            const customer = await customerRepo.findOne({ 
                where: { firstName: 'Test', lastName: 'User' } 
            });
            
            expect(customer).toBeTruthy();
            expect(customer?.phoneNumber).toBe('');
        });
    });
});