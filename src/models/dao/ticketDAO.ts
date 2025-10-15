import {Entity, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {ServiceDAO} from "@models/dao/serviceDAO";
import {CustomerDAO} from "@models/dao/customerDAO";
import {QueueDAO} from "@dao/queueDAO";

@Entity("ticket")
export class TicketDAO {
    @PrimaryColumn({nullable: false})
    ticket_code: number;

    @ManyToOne(
        () => CustomerDAO, 
        (customer) => customer.tickets,
    )
    customer: CustomerDAO;

    @ManyToOne(
        () => ServiceDAO, 
        (service) => service.tickets,
        { cascade: true }
    )
    service: ServiceDAO;

    @OneToOne(
        () => QueueDAO,
        (queue) => queue.ticket,
        { cascade: true, onDelete: 'CASCADE' }
    )
    queue: QueueDAO
}