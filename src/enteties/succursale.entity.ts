import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Departement } from "./departement.entity";

@Entity()
@Unique(['email'])
export class Succursale extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    phone: string;

    @Column()
    email: string;

    @Column({ type: 'text', nullable: true })
    matriculeFiscal: string;

    @Column({ default: true }) // Par défaut, isActive est true
    isActive: boolean;


    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    

    @ManyToMany(() => User, user => user.succursales)
    users: User[];

    @OneToMany(() => Departement, departement => departement.succursale)
    departements: Departement[];


}
