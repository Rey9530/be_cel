import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/users/decorators';
import { mar_usr_usuario } from '@prisma/client';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PaginationDto } from 'src/common/dto/Pagination-dto';
import { UpdateScheduleDto } from './dto';

@ApiTags('Contracts')
@Controller('v1/contracts')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class ContractsController {
  constructor(private readonly projectsService: ContractsService) { }

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.create(createProjectDto, user);
  }


  @Post("schedule/:id")
  createSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.createSchedule(createScheduleDto, user, id);
  }


  @Put("schedule/:idHor")
  updateSchedules(
    @Param('idHor', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.updateSchedules(updateScheduleDto, user, id);
  }

  @Put("schedule/:asiCode/:codHor")
  updateSchedule(
    @Param('asiCode', ParseUUIDPipe) asiCode: string, 
    @Param('codHor', ParseUUIDPipe) codHor: string, 
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.updateSchedule(asiCode, codHor,user);
  }



  @Post("employe/:idCtr/:idEmp")
  addEmployeToContract(
    @Param('idCtr', ParseUUIDPipe) idCtr: string,
    @Param('idEmp', ParseUUIDPipe) idEmp: string,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.addEmployeToContract(idCtr, idEmp, user);
  }

  @Get("list/employes/:id")
  listEmployes(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.listEmployes(id, user);
  }

  @Get("list/schedule/:id")
  listSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.listSchedule(id, user);
  }

  @Get("get/companies")
  getCompanies() {
    return this.projectsService.getCompanies();
  }


  @Get("get/employes/:id")
  getEmployes(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,
    @Query() codeEmploye: PaginationDto,
  ) {
    return this.projectsService.getEmployes(id, user, codeEmploye);
  }
  @Get("get/days")
  getDays() {
    return this.projectsService.getDays();
  }
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: mar_usr_usuario,
  ) {
    return this.projectsService.update(id, updateProjectDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,) {
    return this.projectsService.remove(id, user);
  }

  @Delete('employe/:id')
  deleteEmployes(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,) {
    return this.projectsService.deleteEmployes(id, user);
  }

  @Delete('schedule/:id')
  deleteSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario,) {
    return this.projectsService.deleteSchedule(id, user);
  }
}
