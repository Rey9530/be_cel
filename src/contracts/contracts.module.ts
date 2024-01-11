import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaService } from 'src/common/services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService,PrismaService],
  imports: [UsersModule]
})
export class ContractsModule { }
