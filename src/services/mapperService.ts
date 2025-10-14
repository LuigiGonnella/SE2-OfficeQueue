import { ErrorDTO } from "@models/dto/ErrorDTO";
import type { Service as ServiceDTO } from "@models/dto/Service";
import type { Customer as CustomerDTO } from "@models/dto/Customer";
import type { Queue as QueueDTO } from "@models/dto/Queue";
import type { Counter as CounterDTO } from "@models/dto/Counter";

import type { ServiceDAO } from "@models/dao/serviceDAO";
import type { CustomerDAO } from "@models/dao/customerDAO";
import { QueueDAO } from "@models/dao/queueDAO";
import { CounterDAO } from "@models/dao/counterDAO";
import { Ticket as TicketDTO} from "@models/dto/Ticket";
import { TicketDAO } from "@models/dao/ticketDAO";

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

//QUEUE DTO
export function mapQueueDAOToDTO(queue: QueueDAO): QueueDTO {
  return removeNullAttributes({
    id: queue.id,
    timestamp: queue.timestamp,
    ticket: queue.ticket ? mapTicketDAOToDTO(queue.ticket) : undefined,
    counter: queue.counter,
    served: queue.served,
    served_at: queue.served_at,
    closed_at: queue.closed_at,
  }) as QueueDTO;
}

//COUNTER DTO
export function mapCounterDAOToDTO(counter: CounterDAO): CounterDTO {
  return removeNullAttributes({
    counter_code: counter.counter_code,
    services: counter.services ? counter.services.map(mapServiceDAOToDTO) : undefined,
    queues: counter.queues ? counter.queues.map(mapQueueDAOToDTO) : undefined,
  }) as CounterDTO;
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

export function mapTicketDAOToDTO(ticket: TicketDAO): TicketDTO {
  return removeNullAttributes({
    ticket_code: ticket.ticket_code,
    customer: ticket.customer ? mapCustomerDAOToDTO(ticket.customer) : undefined,
    service: ticket.service ? mapServiceDAOToDTO(ticket.service) : undefined,
  }) as TicketDTO;
}