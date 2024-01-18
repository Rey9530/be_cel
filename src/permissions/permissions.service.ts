import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {  mar_usr_usuario } from '@prisma/client';
import { PrismaService } from 'src/common/services';
import { convert_date } from 'src/common/helpers';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPermissionDto: CreatePermissionDto,
    user: mar_usr_usuario,
  ) {
    var asignacion = await this.prisma.mar_asi_asignacion.findFirst({
      where: {
        asi_codemp: createPermissionDto.per_codemp,
        asi_estado: 'ACTIVE',
      },
      orderBy: {
        asi_feccrea: 'desc',
      },
    });
    if (!asignacion) {
      throw new InternalServerErrorException(
        'No se encuntra un horario asignado al empleado que se le quiere crear el evento',
      );
    }

    var employee = await this.prisma.mar_emp_empleados.findFirst({
      where: {
        emp_codigo: createPermissionDto.per_codemp_reemplazo,
        emp_estado: 'ACTIVE',
      },
    });

    if (!employee) {
      throw new InternalServerErrorException(
        'No se el empleado que reemplazara ',
      );
    }
    try {
      var per_fecha_inicio = convert_date(createPermissionDto.per_fecha_inicio);
      var per_fecha_fin = convert_date(createPermissionDto.per_fecha_fin);
      var data: any = {
        per_codasi: asignacion.asi_codigo,
        per_codemp: asignacion.asi_codemp,
        per_codemp_reemplazo: createPermissionDto.per_codemp_reemplazo,
        per_codmop: createPermissionDto.per_codmop,
        per_fecha_inicio,
        per_fecha_fin,
        per_comentario: createPermissionDto.per_comentario,
        per_usrcrea: user.usr_nombres + ' ' + user.usr_apellidos,
        per_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
      };
      var resp = await this.prisma.mar_per_permisos.create({
        data,
      });
      return resp;
    } catch (error) {
      console.log(error);
      return error.response.message;
    }
  }

  async findAll() {
    return `This action returns all permissions`;
  }

  async findOne(id: string) {
    return await this.prisma.mar_per_permisos.findMany({
      where: {
        per_estado: 'ACTIVE',
        per_codemp: id,
      },
      include: {
        mar_emp_empleado_reemplazo: true,
        mar_mop_motivo_per: true,
      },
    });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  async remove(id: string, user: mar_usr_usuario) {
    return await this.prisma.mar_per_permisos.update({
      data: {
        per_estado: 'INACTIVE',
        per_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
      },
      where: {
        per_codigo: id,
      },
    });
  }
}
