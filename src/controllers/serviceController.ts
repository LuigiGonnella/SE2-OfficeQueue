import type { Service as ServiceDTO } from "@dto/Service";
import { ServiceRepository } from "@repositories/serviceRepository";
import { mapServiceDAOToDTO } from "@services/mapperService";

export const serviceRepo = new ServiceRepository();

export async function getAllServices(): Promise<ServiceDTO[]> {
    return (await serviceRepo.getAllServices()).map(mapServiceDAOToDTO);
}

export async function getServiceById(id: number): Promise<ServiceDTO> {
    return mapServiceDAOToDTO(await serviceRepo.getServiceById(id));
}

export async function getServiceByName(name: string): Promise<ServiceDTO> {
    return mapServiceDAOToDTO(await serviceRepo.getServiceByName(name));
}

export async function createService(serviceDto: ServiceDTO): Promise<void> {
    await serviceRepo.createService(
        serviceDto.name,
        serviceDto.description,
    );
}

export async function deleteService(name: string): Promise<void> {
    await serviceRepo.deleteService(name);
}