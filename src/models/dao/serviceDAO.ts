import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn, ManyToMany,
} from "typeorm";
import { TicketDAO } from "@models/dao/ticketDAO";
import {CounterDAO} from "@dao/counterDAO";

@Entity("service")
export class ServiceDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ 
        type: "text",
        nullable: true,
        default: null,
    })
    description: string | null;

    @Column({
        type: "int",
        unsigned: true,
        nullable: false
    })
    average_service_time: number;

    @OneToMany(
        () => TicketDAO,
        (ticket) => ticket.service,
        { onDelete: 'CASCADE' }
    )
    tickets: TicketDAO[];

    @ManyToMany(() => CounterDAO, (counter) => counter.services)
    counters: CounterDAO[];
}