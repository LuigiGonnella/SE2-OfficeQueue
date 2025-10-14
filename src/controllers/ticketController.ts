import { Ticket as TicketDTO } from "@models/dto/Ticket";
import { TicketRepository } from "@repositories/ticketRepository";
import {mapTicketDAOToDTO} from "@services/mapperService";

export async function getAllTickets(): Promise<TicketDTO[]> {
    const ticketRepo = new TicketRepository();
    const tickets = await ticketRepo.getAllTickets();
    return tickets.map(mapTicketDAOToDTO);
}

  export async function getTicket(ticketCode: number): Promise<TicketDTO> {
    const ticketRepo = new TicketRepository();
    const ticket = await ticketRepo.getTicketByCode(ticketCode);
    return mapTicketDAOToDTO(ticket);
  }

  export async function createTicket(ticketDTO: TicketDTO, customer_id:number, service_id:number): Promise<void> {
    const ticketRepo = new TicketRepository();
    await ticketRepo.createTicket(
      ticketDTO.id,
      customer_id,
      service_id,
    );
  }