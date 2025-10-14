import { ErrorDTO } from "@models/dto/ErrorDTO";

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