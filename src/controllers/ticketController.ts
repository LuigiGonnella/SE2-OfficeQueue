import { TicketDAO } from "@models/dao/ticketDAO";
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

  export async function createTicket(customer_id:number, service_id:number): Promise<TicketDAO> {
    const ticketRepo = new TicketRepository();
    return await ticketRepo.createTicket(
      customer_id,
      service_id,
    );
  }