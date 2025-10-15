import {Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ServiceDAO} from "@dao/serviceDAO";
import {QueueDAO} from "@dao/queueDAO";

@Entity("counter")
export class CounterDAO {

    @PrimaryGeneratedColumn('increment', { type: 'int', unsigned: true })
    id: number;

    @ManyToMany(
        () => ServiceDAO,
        (service) => service.id,
        { cascade: true }
    )
    services: ServiceDAO[]

    @OneToMany(
        () => QueueDAO,
        (queue) => queue.counter,
        { onDelete: 'SET NULL' }
    )
    queues: QueueDAO[]
}