import { ErrorDTO } from "@models/dto/ErrorDTO";
import type { Service as ServiceDTO } from "@models/dto/Service";

import type { ServiceDAO } from "@models/dao/serviceDAO";

export function createErrorDTO(
  code: number,
  message?: string,
  name?: string
): ErrorDTO {
  return removeNullAttributes({
    code,
    name,
    message
  }) as ErrorDTO;
}

//SERVICE DTO

export function mapServiceDAOToDTO(ServiceDao: ServiceDAO): ServiceDTO {
  return removeNullAttributes({
    name: ServiceDao.name,
    description: ServiceDao.description,
  }) as ServiceDTO;
}

function removeNullAttributes<T extends object>(dto: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(dto).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
    )
  ) as Partial<T>;
}