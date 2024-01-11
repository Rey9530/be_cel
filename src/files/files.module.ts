import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/common/services';

import { ConfigModule } from '@nestjs/config';
@Module({
  controllers: [FilesController],
  providers: [FilesService,PrismaService],
  imports: [ConfigModule], 
})
export class FilesModule {}
