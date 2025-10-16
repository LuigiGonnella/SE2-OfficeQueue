import type { Customer as CustomerDTO } from "@dto/Customer";
import { CustomerRepository } from "@repositories/customerRepository";
import { mapCustomerDAOToDTO } from "@services/mapperService";

export const customerRepo = new CustomerRepository();

export async function getAllCustomers(): Promise<CustomerDTO[]> {
    return (await customerRepo.getAllCustomers()).map(mapCustomerDAOToDTO);
}

export async function createCustomer(customerDto: CustomerDTO): Promise<void> {
    await customerRepo.createCustomer(
        customerDto.firstName,
        customerDto.lastName,
        customerDto.phoneNumber
    );
}