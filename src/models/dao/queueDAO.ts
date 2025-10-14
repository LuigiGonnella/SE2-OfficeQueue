import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TicketDAO} from "@dao/ticketDAO";
import {CounterDAO} from "@dao/counterDAO";

@Entity("queue")
export class QueueDAO {
    @PrimaryGeneratedColumn("increment", { type: "int", unsigned: true })
    id: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date = new Date();

    @OneToOne(
        () => TicketDAO,
        (ticket) => ticket.ticket_code,
        { cascade: true, onDelete: 'CASCADE' }
    )
    ticket: TicketDAO;

    @ManyToOne(
        () => CounterDAO,
        (counter) => counter.counter_code
    )
    counter: CounterDAO | null = null;

    @Column({ default: false })
    served: boolean = false;

    // served_at can be null if the ticket has not been served yet or customer did not show up
    @Column({ type: "datetime", nullable: true, default: null })
    served_at: Date | null = null;

    @Column({ type: "datetime", nullable: true, default: null })
    closed_at: Date | null = null;
}