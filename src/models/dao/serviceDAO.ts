import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { TicketDAO } from "@models/dao/ticketDAO";

@Entity("service")
export class ServiceDAO {
    @PrimaryGeneratedColumn()
    id_service: number;

    @Column({ type: "varchar", unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string | null;

    @OneToMany(
        () => TicketDAO,
        (ticket) => ticket.service,
        { onDelete: 'CASCADE' }
    )
    tickets: TicketDAO[];
}