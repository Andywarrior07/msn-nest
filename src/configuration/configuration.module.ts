import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
      }),
    }),
  ],
})
export class ConfigurationModule {}
