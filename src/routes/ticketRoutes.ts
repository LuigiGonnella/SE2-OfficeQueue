import { Router } from "express";
import AppError from "@models/errors/AppError";
import { getAllTickets, createTicket, getTicket } from "@controllers/ticketController";
import { TicketFromJSON } from "@models/dto/Ticket";

const router = Router({mergeParams:true});

export default router;

// Create a new ticket
