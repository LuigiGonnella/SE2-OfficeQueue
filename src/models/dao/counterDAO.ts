import {Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ServiceDAO} from "@dao/serviceDAO";
import {QueueDAO} from "@dao/queueDAO";

@Entity("counter")
export class CounterDAO {

    @PrimaryColumn()
    id: number;

    @ManyToMany(
        () => ServiceDAO,
        (service) => service.counters,
        { cascade: true }
    )
    @JoinTable({
        name: "counter_services",
        joinColumn: { name: "counter_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "service_id", referencedColumnName: "id" }
    })
    services: ServiceDAO[]

    @OneToMany(
        () => QueueDAO,
        (queue) => queue.counter,
        { onDelete: 'SET NULL' }
    )
    queues: QueueDAO[]
}