import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [UsersModule, IamModule, ChatModule, DatabaseModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
