import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {ServiceDAO} from "@models/dao/serviceDAO";
import {CustomerDAO} from "@models/dao/customerDAO";

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
}