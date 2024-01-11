import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { PrismaService } from 'src/common/services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChartsController],
  providers: [ChartsService,PrismaService],
  imports: [UsersModule]
})
export class ChartsModule {}
