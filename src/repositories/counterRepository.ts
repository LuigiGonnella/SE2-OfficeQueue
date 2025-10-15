import {CounterDAO} from "@dao/counterDAO";
import {Repository} from "typeorm";
import {AppDataSource} from "@database";
import {ServiceDAO} from "@dao/serviceDAO";
import {findOrThrowNotFound} from "@utils";

export class CounterRepository {
    private repo: Repository<CounterDAO>;
    private serviceRepo: Repository<ServiceDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(CounterDAO);
    }

    getAllCounters(): Promise<CounterDAO[]> {
        return this.repo.find({ relations: ["services"] });
    }

    getCounterById(counterId: number): Promise<CounterDAO | null> {
        return this.repo.findOne({
            where: { id: counterId },
            relations: ["services"]
        });
    }

    async createCounter(counterId: number, serviceIds: number[]): Promise<CounterDAO> {
        const counter = new CounterDAO();
        counter.id = counterId;
        const services = serviceIds.map(async (id) => {
            return findOrThrowNotFound(
                await this.serviceRepo.find({where: {id}}),
                () => true,
                `Service with id ${id} not found`
            );
        });
        counter.services = await Promise.all(services);
        return this.repo.save(counter);
    }

    async updateCounter(counter_code: number, serviceIds: number[]): Promise<CounterDAO> {
        const counter = findOrThrowNotFound(
            await this.repo.find({ where: { id: counter_code } }),
            () => true,
            `Counter with code ${counter_code} not found`
        )
        const services = serviceIds.map(async (id) => {
            return findOrThrowNotFound(
                await this.serviceRepo.find({where: {id}}),
                () => true,
                `Service with id ${id} not found`
            );
        });
        counter.services = await Promise.all(services);
        return this.repo.save(counter);
    }

    async getAllServicesByCounter(counter_code: number): Promise<ServiceDAO[]> {
        const counter = findOrThrowNotFound(
            await this.repo.find({ where: { id: counter_code }, relations: ["services"] }),
            () => true,
            `Counter with code ${counter_code} not found`
        )
        return counter.services;
    }
}