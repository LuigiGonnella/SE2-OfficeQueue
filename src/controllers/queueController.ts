import {Queue as QueueDTO} from "@models/dto/Queue";
import { Ticket } from "@models/dto/Ticket";
import { QueueRepository } from "@repositories/queueRepository";
import { CounterRepository } from "@repositories/counterRepository";
import { mapQueueDAOToDTO, mapServiceDAOToDTO, mapTicketDAOToDTO } from "@services/mapperService";
import { ServiceDAO } from "@models/dao/serviceDAO";
import { QueueDAO } from "@models/dao/queueDAO";

export async function getAllQueues(): Promise<QueueDTO[]> {
    const queueRepo = new QueueRepository();
    const queues = await queueRepo.getAllQueueEntries();
    return queues.map(mapQueueDAOToDTO);
}

export async function getQueueByService(serviceId: number): Promise<QueueDTO[]> {
    const queueRepo = new QueueRepository();
    const queues = await queueRepo.getCurrentQueueByService(serviceId);
    return queues ? queues.map(mapQueueDAOToDTO) : [];
}

export async function nextCustomer(counterId: number): Promise<Ticket | null> {
    //get all queue entries for all services handled by the counter
    const counterRepo = new CounterRepository();
    const services = await counterRepo.getAllServicesByCounter(counterId);

    //get all queue entries associated with services
    const queueRepo = new QueueRepository();
    let allQueues: Map<ServiceDAO, QueueDAO[]> = new Map();
    for (let service of services) {
        const queues = await queueRepo.getAllQueueEntriesByService(service.id);
        allQueues.set(service, queues);
    }

    //find longest queue list and, if unique, return next ticket
    let longestQueues: Map<ServiceDAO, QueueDAO[]> = new Map(); // map of longest queues (can be multiple if tie)
    for (let [service, queues] of allQueues) {
        if (queues.length === 0) {
            continue;
        }

        // safely get current longest queues (iterator may return undefined.value)
        const iter = longestQueues.values().next();
        const currentLongestQueues = iter.value;

        if (longestQueues.size === 0) {
            longestQueues.set(service, queues);
        }
        else {
            if (currentLongestQueues && queues.length > currentLongestQueues.length) {
                longestQueues.clear();
                longestQueues.set(service, queues);
            }
            else if (currentLongestQueues && queues.length === currentLongestQueues.length) {
                longestQueues.set(service, queues);
            }
        }
    }

    //if unique
    if (longestQueues.size === 1) {
        // Get the next ticket from the longest queue
        const service = longestQueues.keys().next().value;
        if (!service) { //if all queues are empty
            return null;
        }
        const currentQueueEntry = await queueRepo.getCurrentQueueByService(service.id);

        await queueRepo.serveQueueEntry(currentQueueEntry ? currentQueueEntry[0].id : -1); //serve first ticket in queue
        return currentQueueEntry && currentQueueEntry.length > 0 ? mapTicketDAOToDTO(currentQueueEntry[0].ticket) : null;
    }
    else { //if not unique we serve the service with lowest service time
        let minServiceTime = Number.MAX_VALUE;
        let selectedService: ServiceDAO | null = null;

        for (let service of longestQueues.keys()) {
            if (service.average_service_time < minServiceTime) {
                minServiceTime = service.average_service_time;
                selectedService = service;
            }

        }
        if (!selectedService) { //if all queues are empty
            return null;
        }
        const currentQueueEntry = await queueRepo.getCurrentQueueByService(selectedService.id);

        await queueRepo.serveQueueEntry(currentQueueEntry ? currentQueueEntry[0].id : -1); //serve first ticket in queue
        return currentQueueEntry && currentQueueEntry.length > 0 ? mapTicketDAOToDTO(currentQueueEntry[0].ticket) : null;
    }

}