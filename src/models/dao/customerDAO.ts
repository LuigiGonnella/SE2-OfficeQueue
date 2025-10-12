import {Column, Entity,  OneToMany, PrimaryColumn} from "typeorm";
import {TicketsDAO} from "@dao/TicketsDAO";

@Entity("customers")
export class CustomerDAO {
    @PrimaryColumn({nullable: false})
    customer_id:number;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @OneToMany(() => TicketDAO, (ticket) => ticket.customer, { cascade: true })
    tickets: TicketDAO[];

    
}