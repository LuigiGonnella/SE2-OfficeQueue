import {Entity, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {ServiceDAO} from "@dao/serviceDAO";
import {QueueDAO} from "@dao/queueDAO";

@Entity("counter")
export class CounterDAO {

    @PrimaryColumn({nullable: false})
    counter_code: string;

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