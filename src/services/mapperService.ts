import { ErrorDTO } from "@models/dto/ErrorDTO";
import type { Service as ServiceDTO } from "@models/dto/Service";
import type { Customer as CustomerDTO } from "@models/dto/Customer";

import type { ServiceDAO } from "@models/dao/serviceDAO";
import type { CustomerDAO } from "@models/dao/customerDAO";

export function createErrorDTO(
  code: number,
  message?: string,
  name?: string
): ErrorDTO {
  return removeNullAttributes({
    code,
    name,
    message
  }) as ErrorDTO;
}

//SERVICE DTO

export function mapServiceDAOToDTO(ServiceDao: ServiceDAO): ServiceDTO {
  return removeNullAttributes({
    name: ServiceDao.name,
    description: ServiceDao.description,
  }) as ServiceDTO;
}

//CUSTOMER DTO

export function mapCustomerDAOToDTO(CustomerDao: CustomerDAO): CustomerDTO {
  return removeNullAttributes({
    firstName: CustomerDao.firstName,
    lastName: CustomerDao.lastName,
    phoneNumber: CustomerDao.phoneNumber,
  }) as CustomerDTO;
}

function removeNullAttributes<T extends object>(dto: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(dto).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
    )
  ) as Partial<T>;
}

export function mapTicketDAOToDTO(ticket: any): any {
  return {
    ticket_code: ticket.ticket_code,
    customer_id: ticket.customer_id,
    id_service: ticket.id_service,
  };
}