import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {
        const logging =
            configService.get<string>('nodeEnv') === 'development'
                ? true
                : false;
        const sslRequired =
            configService.get<string>('nodeEnv') === 'development'
                ? true
                :false;
        return {
            // type: 'postgres',
            // host: configService.get<string>('database.host'),
            // port: configService.get<number>('database.port'),
            // username: configService.get<string>('database.username'),
            // password: configService.get<string>('database.password'),
            // database: configService.get<string>('database.name'),
            // logging: logging,
            // synchronize: true, // Set synchronize to true for automatic schema synchronization
            // autoLoadEntities: true,
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: +configService.get<number>('POSTGRES_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DATABASE'),
            autoLoadEntities: true,
            synchronize: true,
            extra: {
                charset: 'utf8mb4_unicode_ci',
            },
            ssl: false,
	    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
        };
    },
};
config();
const configService = new ConfigService();

const connectionOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: true,
    synchronize: false,
    migrationsRun:true,
    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
    migrations: [`${__dirname}/../migrations/*.{js,ts}`],
    ssl: false
};

export const typeOrmConfig = new DataSource({...connectionOptions});
