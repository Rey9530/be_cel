import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { EmployesModule } from './employes/employes.module';
import { ContractsModule } from './contracts/contracts.module';
import { MarkingsModule } from './markings/markings.module';
import { SeedModule } from './seed/seed.module'; 
import { FilesModule } from './files/files.module'; 
import { ChartsModule } from './charts/charts.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    CompaniesModule,
    UsersModule,
    EmployesModule,
    ContractsModule,
    MarkingsModule,
    SeedModule,
    FilesModule,
    ChartsModule,  
  ],
})
export class AppModule { }
