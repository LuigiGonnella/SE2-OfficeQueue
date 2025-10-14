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

    getCounterByCode(counter_code: string): Promise<CounterDAO | null> {
        return this.repo.findOne({
            where: { counter_code },
            relations: ["services"]
        });
    }

    async createCounter(counter_code: string, serviceIds: number[]): Promise<CounterDAO> {
        const counter = new CounterDAO();
        counter.counter_code = counter_code;
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

    async updateCounter(counter_code: string, serviceIds: number[]): Promise<CounterDAO> {
        const counter = findOrThrowNotFound(
            await this.repo.find({ where: { counter_code } }),
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
}