import {Entity, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ServiceDAO} from "@dao/serviceDAO";
import {QueueDAO} from "@dao/queueDAO";
import { CounterDAO } from "./counterDAO";

@Entity("officer")
export class OfficerDAO {

    @PrimaryGeneratedColumn('increment', { type: 'int', unsigned: true })
    id: number;

    @OneToOne(
        () => CounterDAO,  
        (counter) => counter.id,
        { cascade: true }
    )
    counter: CounterDAO;

}