import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaService } from 'src/common/services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService,PrismaService],
  imports: [
    UsersModule
  ]
})
export class PermissionsModule {}
