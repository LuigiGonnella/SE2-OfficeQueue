import { Request, Response } from "express";
import { boardBus } from "@services/boardService";
import { logError } from "@services/loggingService";
import { InternalServerError } from "@errors/InternalServerError";
import {QueueRepository} from "@repositories/queueRepository";
import {ServiceRepository} from "@repositories/serviceRepository";

export async function getBoardCurrent(_req: Request, res: Response): Promise<void> {
    try {
        const queueRepo = new QueueRepository();
        const recent = await queueRepo.getLastSixServed()
        //const calls = boardBus.getRecent();
        const result = recent.map((r) => {
            return {
                ticket: r.ticket.ticket_code,
                service: r.ticket.service.name,
                counter: r.counter?.id
            }
        });
        res.status(200).json(result);
    } catch (error) {
        logError("Error in getBoardCurrent", error);
        throw new InternalServerError("Failed to fetch board current calls");
    }
}

export async function getBoardQueues(_req: Request, res: Response): Promise<void> {
    try {
        const queueRepo = new QueueRepository();
        const serviceRepo = new ServiceRepository();
        const services = await serviceRepo.getAllServices();
        const promises = services.map(async (s) => {
           const id = s.id;
           const q = await queueRepo.getCurrentQueueByService(id);
           return {service_id: id, service_name: s.name, queue: q?.length ?? 0};
        });
        const queues = await Promise.all(promises);
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