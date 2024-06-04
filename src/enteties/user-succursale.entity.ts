import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Succursale } from "./succursale.entity";


@Entity()
export class UserSuccursale extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userSuccursales)
    @JoinColumn({ name: "userId" }) 
    user: User;

    @ManyToOne(() => Succursale, succursale => succursale.userSuccursales)
    @JoinColumn({ name: "succursaleId" })
    succursale: Succursale;

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
