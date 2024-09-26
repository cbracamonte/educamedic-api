import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './core/config/app.config';
import corsConfig from './core/config/cors.config';
import swaggerConfig from './core/config/swagger.config';
import authenticationConfig from './core/config/authentication.config';
import { HttpModule } from '@nestjs/axios';
import { HealthModule } from './features/health/health.module';
import { CoursesModule } from './features/core/courses/courses.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongodbConfig from './core/config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, corsConfig, mongodbConfig, swaggerConfig, authenticationConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigType<typeof mongodbConfig>) => ({
        uri: config.uri,
      }),
      inject: [mongodbConfig.KEY],
    }),
    HttpModule,
    HealthModule,
    CoursesModule,
  ],
})
export class AppModule {}
