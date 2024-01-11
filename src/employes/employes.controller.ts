import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { EmployesService } from './employes.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { mar_usr_usuario } from '@prisma/client';
import { Auth, GetUser } from 'src/users/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { CodeEmployeDto } from './dto/code-employe.dto';
import { PaginationDto } from 'src/common/dto/Pagination-dto';

@ApiTags('Employes')
@Auth()
@Controller('v1/employes')
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class EmployesController {
  constructor(private readonly employesService: EmployesService) {}

  @Post()
  create(
    @Body() createEmployeDto: CreateEmployeDto,
    @GetUser() user: mar_usr_usuario,
  ): Promise<CreateEmployeDto> {
    return this.employesService.create(createEmployeDto, user);
  }
  @Post('generatecode')
  generateCode(@Body() codeEmploye: CodeEmployeDto): Promise<any> {
    return this.employesService.generateCode(codeEmploye);
  }

  @Get()
  findAll(@Query() codeEmploye: PaginationDto) {
    return this.employesService.findAll(codeEmploye);
  }

  @Get('get/catalogs')
  getCatalogs() {
    return this.employesService.getCatalogs();
  }

  @Get('get/contracts/:id')
  getContracts(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.employesService.getContracts(id,user);
  }

  @Get('get/contracts/hours/:id')
  getHoursContracts(
    @Param('id', ParseUUIDPipe) id: string, 
  ) {
    return this.employesService.getHoursContracts(id);
  }

  @Get('get/sedes')
  getSedes() {
    return this.employesService.getSedes();
  }

  @Get('get/gender')
  getGender() {
    return this.employesService.getGender();
  }

  @Get('get/contratation')
  getContratation() {
    return this.employesService.getContratation();
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeDto: UpdateEmployeDto,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.employesService.update(id, updateEmployeDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.employesService.remove(id, user);
  }
}
