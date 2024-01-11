import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { mar_usr_usuario } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service'; 

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger('CompaniesService');
  constructor(private prisma: PrismaService) {}
  async create(createCompanyDto: CreateCompanyDto, user: mar_usr_usuario) {
    try {
      const userFullName = user.usr_nombres + ' ' + user.usr_apellidos;
      var data: any = {
        // epr_codusr: user.usr_codigo,
        epr_nombre: createCompanyDto.empre_nombre,
        epr_direccion: createCompanyDto.empre_direccion,
        epr_contacto_nombre: createCompanyDto.empre_contacto_nombre,
        epr_contacto_correo: createCompanyDto.empre_contacto_correo,
        epr_contacto_telefono: createCompanyDto.empre_contacto_telefono,
        epr_usrcrea: userFullName,
        epr_usrmod: userFullName, 
      };
      const register = await this.prisma.mar_epr_empresas.create({ data }); 
      return register;
    } catch (error) {
      this.logger.error(error);
      if (error.code === '23505') throw new BadRequestException(error.detail);
      return error;
    }
  }

  findAll() {
    return this.prisma.mar_epr_empresas.findMany({
      where: { epr_estado: 'ACTIVE' },
      orderBy: { epr_nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    let register = await this.prisma.mar_epr_empresas.findFirst({
      where: { epr_codigo: id, epr_estado: 'ACTIVE' },
    });
    if (!register) throw new NotFoundException(`Regisro no encontrado`);
    return register;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: mar_usr_usuario,
  ) {
    await this.findOne(id);
    try {
      const userFullName = user.usr_nombres + ' ' + user.usr_apellidos;
      var data: any = { 
        // epr_codusr: user.usr_codigo,
        epr_nombre: updateCompanyDto.empre_nombre,
        epr_direccion: updateCompanyDto.empre_direccion,
        epr_contacto_nombre: updateCompanyDto.empre_contacto_nombre,
        epr_contacto_correo: updateCompanyDto.empre_contacto_correo,
        epr_contacto_telefono: updateCompanyDto.empre_contacto_telefono, 
        epr_usrmod: userFullName, 
      };
      const RespDb = await this.prisma.mar_epr_empresas.update({
        where: { epr_codigo: id },
        data,
      }); 
      if (!RespDb) throw new NotFoundException(`Empresa no encontrada`);
      return RespDb;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string, user: mar_usr_usuario) {
    await this.findOne(id);
    try {
      const userFullName = user.usr_nombres + ' ' + user.usr_apellidos;
      const RespDb = await this.prisma.mar_epr_empresas.update({
        where: { epr_codigo: id },
        data: {
          epr_estado: 'INACTIVE',
          epr_usrmod: userFullName,
        },
      });
      if (!RespDb) throw new NotFoundException(`Empresa no encontrada`);
      return RespDb;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }
}
