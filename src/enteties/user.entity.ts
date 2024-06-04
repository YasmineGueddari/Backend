import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Role } from "src/common/enum/role.enum";
import { getRepository } from "typeorm";
import { UserSuccursale } from "./user-succursale.entity";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    firstName: string;

    @Column({ type: 'text', nullable: true })
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'text', nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: Role })
    role: Role;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column()
    salt: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
  
    
    @OneToMany(() => UserSuccursale, userSuccursale => userSuccursale.user)
    userSuccursales: UserSuccursale[];

}
