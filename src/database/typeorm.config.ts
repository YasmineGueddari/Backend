//Configurez TypeORM pour Utiliser les Variables d'Environnement
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME || 'default_username',
  password: process.env.DB_PASSWORD || 'default_password',
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
};

// Log to verify environment variables are loaded correctly
//console.log('Database Type:', process.env.DB_TYPE);
//console.log('Database Host:', process.env.DB_HOST);
//console.log('Database Port:', process.env.DB_PORT);
//console.log('Database Username:', process.env.DB_USERNAME);
//console.log('Database Name:', process.env.DB_DATABASE);
