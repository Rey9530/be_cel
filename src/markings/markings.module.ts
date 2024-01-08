import { Module } from '@nestjs/common';
import { MarkingsService } from './markings.service';
import { MarkingsController } from './markings.controller';
import { PrismaService } from 'src/common/services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [MarkingsController],
  providers: [MarkingsService, PrismaService],
  imports: [UsersModule]
})
export class MarkingsModule { }
