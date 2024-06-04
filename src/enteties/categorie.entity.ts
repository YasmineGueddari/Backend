import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Bien } from './bien.entity';
import { SousCategorie } from './sous-categorie.entity';

@Entity()
export class Categorie {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  
  @Column({ default: true }) // Par défaut, isActive est true
    isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
 
  @OneToMany(() => Bien, bien => bien.categorie)
  biens: Bien[];

  @OneToMany(() => SousCategorie, sousCategorie => sousCategorie.categorie)
  sousCategories: SousCategorie[];
}
