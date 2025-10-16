import { AppDataSource } from "@database";
import { CustomerDAO } from "@models/dao/customerDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Repository } from "typeorm";
import AppError from "@models/errors/AppError";

export class CustomerRepository {
    private repo: Repository<CustomerDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(CustomerDAO);
    }

    // recupera tutti i customers
    async getAllCustomers(): Promise<CustomerDAO[]> {
        return await this.repo.find();
    }

    //crea un nuovo service
    async createCustomer(
        firstName: string,
        lastName: string,
        phoneNumber?: string
    ): Promise<void> {
        if (!firstName || firstName.trim().length < 1 || !lastName || lastName.trim().length < 1) {
            throw new AppError("Invalid input data", 400);
    }
        firstName = firstName.trim();
        lastName = lastName.trim();
        throwConflictIfFound(
            await this.repo.find({ where: { firstName, lastName }}),
            () => true,
            `Customer already exists with name ${firstName} ${lastName}`,
        );

        await this.repo.save({ firstName, lastName, phoneNumber });
    }
}