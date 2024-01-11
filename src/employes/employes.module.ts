import { Module } from '@nestjs/common';
import { EmployesService } from './employes.service';
import { EmployesController } from './employes.controller';
import { PrismaService } from 'src/common/services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [EmployesController],
  providers: [EmployesService,PrismaService],
  imports: [
    UsersModule
  ]
})
export class EmployesModule { }
