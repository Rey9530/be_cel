import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { PrismaService } from 'src/common/services';
import {
  mar_asi_asignacion,
  mar_emp_empleados,
  mar_usr_usuario,
} from '@prisma/client';
import { isUUID } from 'class-validator';
import { CodeEmployeDto } from './dto/code-employe.dto';
import { PaginationDto } from 'src/common/dto/Pagination-dto';
import { convert_date } from 'src/common/helpers/conver_date.heper';

@Injectable()
export class EmployesService {
  private readonly logger = new Logger('EmployesService');

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEmployeDto: CreateEmployeDto,
    user: mar_usr_usuario,
  ): Promise<any> {
    var emp_fecha_nacimiento = convert_date(
      createEmployeDto.emp_fecha_nacimiento,
    );
    var usuariosName = user.usr_nombres + ' ' + user.usr_apellidos;
    var data: any = {
      emp_codgen: createEmployeDto.marca_emp_gen,
      emp_codubi: createEmployeDto.marca_emp_ubi,
      emp_codcon: createEmployeDto.marca_emp_cn,
      emp_feccrea: new Date(),
      emp_fecmod: new Date(),
      emp_usrcrea: usuariosName,
      emp_usrmod: usuariosName,
      emp_estado: 'ACTIVE',
      emp_codemp: createEmployeDto.marca_emp_empre,
      emp_codigo_emp: createEmployeDto.emp_codigo,
      emp_fecha_nacimiento,
      emp_nombres: createEmployeDto.emp_nombres,
      emp_apellidos: createEmployeDto.emp_apellidos,
    };
    try {
      var employe = await this.prisma.mar_emp_empleados.create({ data });

      if (
        createEmployeDto.marca_asig_proy &&
        isUUID(createEmployeDto.marca_asig_proy) &&
        isUUID(createEmployeDto.marca_asig_hour)
      ) {
        //TODO: Agregar validacion para verificar si existe el horarrio
        var contract: any = {
          asi_usrcrea: usuariosName,
          asi_usrmod: usuariosName,
          asi_codemp: employe.emp_codigo,
          asi_codhor: createEmployeDto.marca_asig_hour,
        };
        await this.prisma.mar_asi_asignacion.create({ data: contract });
      }
      return employe;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getSedes() {
    return await this.prisma.mar_ubi_ubicaciones.findMany({
      where: { ubi_estado: 'ACTIVE' },
      select: { ubi_codigo: true, ubi_nombre: true },
    });
  }

  async getContracts(idEmp: string, user: mar_usr_usuario) {
    return await this.prisma.mar_ctr_contratos.findMany({
      where: {
        ctr_estado: 'ACTIVE',
        ctr_codepr: idEmp,
        ctr_codusr: user.usr_codigo,
      },
      select: { ctr_codigo: true, ctr_nombre: true },
    });
  }
  async getHoursContracts(idCtr: string) {
    return await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_estado: 'ACTIVE',
        hor_codctro: idCtr,
      },
      select: { hor_codigo: true, hor_nombre: true },
    });
  }

  async getCompanies() {
    return await this.prisma.mar_epr_empresas.findMany({
      where: { epr_estado: 'ACTIVE' },
      select: { epr_codigo: true, epr_nombre: true },
    });
  }
  async getCatalogs() {
    const [sedes, contratation, gender, companies] = await Promise.all([
      await this.getSedes(),
      await this.getContratation(),
      await this.getGender(),
      await this.getCompanies(),
    ]);
    return { sedes, contratation, gender, companies };
  }

  async getContratation() {
    return await this.prisma.mar_con_contrataciones.findMany({
      where: { con_estado: 'ACTIVE' },
      select: { con_codigo: true, con_nombre: true },
    });
  }

  async getGender() {
    return await this.prisma.mar_gen_generos.findMany({
      where: { gen_estado: 'ACTIVE' },
      select: { gen_codigo: true, gen_nombre: true },
    });
  }

  async findAll(codeEmploye: PaginationDto) {
    try {
      var or_ = {};
      if (codeEmploye.query.length > 3) {
        var arrayWhere = [];
        var arrayWords = codeEmploye.query.split(' ');
        arrayWords.forEach((contains) => {
          if (contains.length > 0) {
            arrayWhere.push({
              emp_nombres: {
                contains,
                mode: 'insensitive',
              },
            });
            arrayWhere.push({
              emp_apellidos: {
                contains,
                mode: 'insensitive',
              },
            });
            arrayWhere.push({
              emp_codigo_emp: {
                contains,
                mode: 'insensitive',
              },
            });
          }
        });
        or_ = { OR: arrayWhere };
      }
      var wCompany = {};
      if (isUUID(codeEmploye.company)) {
        wCompany = { emp_codemp: codeEmploye.company };
      }
      var where: any = { ...wCompany, emp_estado: 'ACTIVE', ...or_ };

      var employes = await this.prisma.mar_emp_empleados.findMany({
        where,
        orderBy: { emp_nombres: 'asc' },
        include: {
          mar_gen_generos: true,
          mar_asi_asignacion: true,
          mar_con_contrataciones: true,
          mar_ubi_ubicaciones: true,
        },
        take: Number(codeEmploye.quantity),
        skip: (Number(codeEmploye.page) - 1) * Number(codeEmploye.quantity),
      });
      const total = await this.prisma.mar_emp_empleados.count({ where });
      return {
        employes,
        pagination: {
          page: Number(codeEmploye.page),
          quantity: Number(codeEmploye.quantity),
          total,
        },
      };
    } catch (error) {
      console.log(error.toString());
      throw new InternalServerErrorException('Ha ocurrido un error favor intentarlo mas tarde');
    }
  }
  async generateCode(codeEmploye: CodeEmployeDto) {
    var dateArray = codeEmploye.emp_fecha_nacimiento.split('/');
    var year = dateArray[2].toString();
    var precode = year[2] + year[3] + dateArray[1];

    var respDb = await this.prisma.mar_emp_empleados.findMany({
      where: { emp_estado: 'ACTIVE', emp_codigo: { contains: precode } },
    });
    var code =
      precode.toString() +
      (respDb.length + 1).toString().padStart(3, '0').toString();

    return { code: code };
  }

  async findOne(id: string) {
    var respDb = await this.prisma.mar_emp_empleados.findFirst({
      where: { emp_estado: 'ACTIVE', emp_codigo: id },
      include: {
        mar_gen_generos: true,
        mar_asi_asignacion: {
          select: {
            mar_hor_horarios: {
              select: {
                mar_ctr_contratos: {
                  select: { ctr_nombre: true, ctr_codigo: true },
                },
              },
            },
          },
        },
        mar_con_contrataciones: true,
        mar_ubi_ubicaciones: true,
      },
    });
    if (!respDb) throw new NotFoundException(`Regisro no encontrado`);
    return respDb;
  }

  async update(
    id: string,
    updateEmployeDto: UpdateEmployeDto,
    user: mar_usr_usuario,
  ) {
    var usuariosName = user.usr_nombres + ' ' + user.usr_apellidos;
    await this.findOne(id);
    var emp_fecha_nacimiento = convert_date(
      updateEmployeDto.emp_fecha_nacimiento,
    );
    var data: any = {
      emp_codgen: updateEmployeDto.marca_emp_gen,
      emp_codubi: updateEmployeDto.marca_emp_ubi,
      emp_codcon: updateEmployeDto.marca_emp_cn,
      emp_feccrea: new Date(),
      emp_fecmod: new Date(),
      emp_usrcrea: usuariosName,
      emp_usrmod: usuariosName,
      emp_codemp: updateEmployeDto.marca_emp_empre,
      emp_codigo_emp: updateEmployeDto.emp_codigo,
      emp_fecha_nacimiento,
      emp_nombres: updateEmployeDto.emp_nombres,
      emp_apellidos: updateEmployeDto.emp_apellidos,
    };
    try {
      const register = await this.prisma.mar_emp_empleados.update({
        where: { emp_codigo: id, emp_estado: 'ACTIVE' },
        data,
      });
      return register;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string, user: mar_usr_usuario) {
    await this.findOne(id);
    try {
      const register = await this.prisma.mar_emp_empleados.update({
        where: { emp_codigo: id, emp_estado: 'ACTIVE' },
        data: {
          emp_estado: 'INACTIVE',
          emp_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
          emp_fecmod: new Date(),
        },
      });
      return register;
    } catch (error) {
      return error;
    }
  }
}
