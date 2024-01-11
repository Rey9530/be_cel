import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/users/decorators';
import { mar_usr_usuario } from '@prisma/client'; 
import { HEADER_API_BEARER_AUTH } from 'src/common/const'; 

@ApiTags('Companies')
@Controller('v1/companies') 
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'Empresa creada' })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: mar_usr_usuario
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Listado de empresas' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Empresa' })
  findOne(@Param('id', ParseUUIDPipe) id: string,) {
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Empresa Actualizada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: mar_usr_usuario) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Empresa eliminada' })
  remove(@Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: mar_usr_usuario) {
    return this.companiesService.remove(id, user);
  }
}
