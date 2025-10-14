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
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ 
        nullable: true,
        default: null,
    })
    description: string | null;

    @OneToMany(
        () => TicketDAO,
        (ticket) => ticket.service,
        { onDelete: 'CASCADE' }
    )
    tickets: TicketDAO[];
}