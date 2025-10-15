import type { Counter as CounterDTO } from "@dto/Counter";
import { Service } from "@models/dto/Service";
import { CounterRepository } from "@repositories/counterRepository";
import { mapCounterDAOToDTO, mapServiceDAOToDTO } from "@services/mapperService";

export const counterRepo = new CounterRepository();

export async function getAllCounters(): Promise<CounterDTO[]> {
    return (await counterRepo.getAllCounters()).map(mapCounterDAOToDTO);
}

export async function createCounter(counterDto: CounterDTO): Promise<void> {
    await counterRepo.createCounter(
        counterDto.id,
        counterDto.services.map(s => s.id)
    );
}

export async function updateCounter(counterDto: CounterDTO): Promise<void> {
    await counterRepo.updateCounter(
        counterDto.id,
        counterDto.services.map(s => s.id)
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