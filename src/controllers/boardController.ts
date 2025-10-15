import { Request, Response } from "express";
import { boardBus } from "@services/boardService";
import { TicketRepository } from "@repositories/ticketRepository";
import { logError } from "@services/loggingService";
import { InternalServerError } from "@errors/InternalServerError";

export async function getBoardCurrent(_req: Request, res: Response): Promise<void> {
    try {
        const calls = boardBus.getRecent();
        res.status(200).json(calls);
    } catch (error) {
        logError("Error in getBoardCurrent", error);
        throw new InternalServerError("Failed to fetch board current calls");
    }
}

export async function getBoardQueues(_req: Request, res: Response): Promise<void> {
    try {
        const ticketRepo = new TicketRepository();
        const queues = await ticketRepo.getQueueLengthsByService();
        res.status(200).json(queues);
    } catch (error) {
        logError("Error in getBoardQueues", error);
        throw new InternalServerError("Failed to fetch queue lengths");
    }
}

export async function streamBoard(req: Request, res: Response): Promise<void> {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const onUpdate = (payload: unknown) => {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    boardBus.on("update", onUpdate);

    req.on("close", () => {
        boardBus.off("update", onUpdate);
    });
}