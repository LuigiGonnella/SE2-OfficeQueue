import type { Counter as CounterDTO } from "@dto/Counter";
import { Service } from "@models/dto/Service";
import { CounterRepository } from "@repositories/counterRepository";
import { mapCounterDAOToDTO, mapServiceDAOToDTO } from "@services/mapperService";

export const counterRepo = new CounterRepository();

export async function getAllCounters(): Promise<CounterDTO[]> {
    return (await counterRepo.getAllCounters()).map(mapCounterDAOToDTO);
}

export async function createCounter(counter: {id: number, serviceIds: number[]}): Promise<CounterDTO> {
    return await counterRepo.createCounter(
        counter.id,
        counter.serviceIds
    ).then(mapCounterDAOToDTO);
}

export async function updateCounter(counter: {id: number, serviceIds: number[]}): Promise<void> {
    await counterRepo.updateCounter(
        counter.id,
        counter.serviceIds
    );
}

export async function getCounterById(counterId: number): Promise<CounterDTO | null> {
    const counter = await counterRepo.getCounterById(counterId);
    return counter ? mapCounterDAOToDTO(counter) : null;
}

export async function getAllServicesByCounter(counterId: number): Promise<Service[]> {
    const services = await counterRepo.getAllServicesByCounter(counterId);
    return services ? services.map(mapServiceDAOToDTO) : [];
}