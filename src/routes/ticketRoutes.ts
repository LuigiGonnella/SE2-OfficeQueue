import { Router } from "express";
import AppError from "@models/errors/AppError";
import { getAllTickets, createTicket, getTicket } from "@controllers/ticketController";
import { TicketFromJSON } from "@models/dto/Ticket";
import { mapTicketDAOToDTO } from "@services/mapperService";

const router = Router({mergeParams:true});

export default router;

// Create a new ticket
router.get("/", async (req, res, next) => {
    try {
        const result = await getAllTickets();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:ticketCode", async (req, res, next) => {
    try {  
        const ticketCode = Number(req.params.ticketCode);
        const result = await getTicket(ticketCode);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const ticket = await createTicket(req.body.customer, req.body.service);
        res.status(201).json(mapTicketDAOToDTO(ticket));
    } catch (error) {
        next(error);
    }
});
