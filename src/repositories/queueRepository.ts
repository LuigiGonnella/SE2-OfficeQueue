import {QueueDAO} from "@dao/queueDAO";
import {AppDataSource} from "@database";
import {Repository} from "typeorm";

export class QueueRepository {
    private repo: Repository<QueueDAO>;

    constructor() {
        this.repo = AppDataSource.getRepository(QueueDAO);
    }

    getAllQueueEntries(): Promise<QueueDAO[]> {
        return this.repo.find({ relations: ["ticket"] });
    }

    getCurrentQueue(): Promise<QueueDAO[] | null> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return this.repo.createQueryBuilder("queue")
            .leftJoinAndSelect("queue.ticket", "ticket")
            .where("queue.served = :served", { served: false })
            .andWhere("queue.timestamp BETWEEN :startOfDay AND :endOfDay", { startOfDay, endOfDay })
            .orderBy("queue.timestamp", "ASC")
            .getMany();
    }

    getCurrentQueueByService(id_service: number): Promise<QueueDAO[] | null> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return this.repo.createQueryBuilder("queue")
            .leftJoinAndSelect("queue.ticket", "ticket")
            .leftJoinAndSelect("ticket.service", "service")
            .where("queue.served = :served", { served: false })
            .andWhere("service.id = :id_service", { id_service })
            .andWhere("queue.timestamp BETWEEN :startOfDay AND :endOfDay", { startOfDay, endOfDay })
            .orderBy("queue.timestamp", "ASC")
            .getMany();
    }

    getLastFiveServed(): Promise<QueueDAO[]> {
        return this.repo.createQueryBuilder("queue")
            .leftJoinAndSelect("queue.ticket", "ticket")
            .where("queue.served = :served", { served: true })
            .orderBy("queue.served_at", "DESC")
            .limit(5)
            .getMany();
    }
}