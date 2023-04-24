import { Module } from '@nestjs/common';
import { IamController } from './controllers/iam.controller';
import { IamService } from './services/iam.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';

@Module({
  controllers: [IamController],
  exports: [IamService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // audience: process.env.JWT_TOKEN_AUDIENCE,
        // issuer: process.env.JWT_TOKEN_ISSUER,
        accessTokenTtl: configService.get<string>('JWT_ACCESS_TOKEN_TTL'),
        // refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    IamService,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    { provide: HashingService, useClass: BcryptService },
  ],
})
export class IamModule {}
