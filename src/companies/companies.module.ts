import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller'; 
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/common/services';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService,PrismaService],
  imports: [ 
    UsersModule
  ]
})
export class CompaniesModule { }
