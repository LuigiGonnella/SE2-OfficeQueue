import {Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, JoinColumn} from "typeorm";
import {ServiceDAO} from "@models/dao/serviceDAO";
import {CustomerDAO} from "@models/dao/customerDAO";

@Entity("ticket")
export class TicketDAO {
    @PrimaryColumn({nullable: false})
    ticket_code: number;

    @OneToOne(() => CustomerDAO, (customer) => customer.tickets)
    customer: CustomerDAO;

    @OneToOne(() => ServiceDAO, (service) => service.tickets)
    service: ServiceDAO;
}