import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config'
import { Bien } from "src/enteties/bien.entity";
import { Categorie } from "src/enteties/categorie.entity";
import { Reservation } from "src/enteties/reservation.entity";
import { Departement } from "src/enteties/departement.entity";
import { SousCategorie } from "src/enteties/sous-categorie.entity";
import { User } from "src/enteties/user.entity";

const dbConfig = config.get('db')

export const typeOrmConfig: TypeOrmModuleOptions={
    type: dbConfig.type,
    host:  dbConfig.host,
    port:dbConfig.port,
    username:dbConfig.username,
    password:dbConfig.password,
    database: dbConfig.database,
    entities:["dist/**/*.entity{.ts,.js}"],
    synchronize: dbConfig.synchronize,

    
}