import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as fs from 'fs';
import { UPLOADFILE } from 'src/common/const';
import { PrismaService } from 'src/common/services';
import { promisify } from 'util';
import axios, { AxiosResponse } from 'axios';
import { mar_his_historial } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly renameAsync = promisify(fs.rename);
  private readonly unlinkAsync = promisify(fs.unlink);
  private readonly accessAsync = promisify(fs.access);
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await this.accessAsync(filePath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
  async deleteFileExists(filePath: string): Promise<boolean> {
    try {
      await this.unlinkAsync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
  async renameFile(file: any, code: string): Promise<void> {
    let newPath = UPLOADFILE + '/' + code + '.png';
    let user = await this.prisma.mar_emp_empleados.findFirst({
      where: {
        emp_codigo_emp: code,
        emp_estado: 'ACTIVE',
      },
    });
    if (!user) {
      await this.unlinkAsync(file.path);
      throw new UnauthorizedException('Empleado no encontrado');
    }

    const exists = await this.fileExists(newPath);
    if (exists) {
      await this.unlinkAsync(file.path);
      throw new UnauthorizedException('Empleado ya esta enrolado');
    }

    try {
      await this.renameAsync(file.path, newPath);
      console.log(`Archivo renombrado de ${file.path} a ${newPath}`);
    } catch (error) {
      // Manejo de errores
      console.error('Error al renombrar el archivo:', error);
      throw error;
    }
  }

  async identify(file: any): Promise<any> {

    const exists = await this.fileExists(file.path);
    if (!exists) {
      throw new UnauthorizedException(
        'Ha ocurrido un error al generar el escaneo',
      );
    }
    let name = file.filename.split('.');
    let employee_code = await this.obtenerDatos(name[0]);
    await this.deleteFileExists(file.path);
    if (employee_code == 'no encontrada') {
      throw new UnauthorizedException('Empleado no encontrado');
    }
    let code = employee_code.replace('.png', '');
    let employe = await this.prisma.mar_emp_empleados.findFirst({
      where: {
        emp_codigo_emp: code,
        emp_estado: 'ACTIVE',
      },
    });
    if (!employe) {
      throw new UnauthorizedException('Empleado no encontrado');
    }
    let empAsig = await this.prisma.mar_asi_asignacion.findFirst({
      where: {
        asi_codemp: employe.emp_codigo,
        asi_estado: 'ACTIVE',
      },
      include: {
        mar_hor_horarios: true,
      },
    });
    if (!empAsig) {
      throw new InternalServerErrorException(
        'El empleado no horario asignado, verificar con el administrador del contrato',
      );
    }
    let startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    let endDate = new Date();
    let hisRecent = await this.prisma.mar_his_historial.findFirst({
      where: {
        his_codasi: empAsig.asi_codigo,
        emp_estado: 'ACTIVE',
        his_feccrea: {
          gte: startDate, // Mayor o igual que startDate
          lte: endDate
        }
      },
    }); 


    if (hisRecent) {
      let msg = hisRecent.his_hora_salida == null ? 'de entrada' : 'de salida';
      throw new InternalServerErrorException(
        'Ya se realizo una marcacion '+msg,
      );
    }
    try {

      let marcacion_hora = new Date();
      let days = await this.prisma.mar_dia_dias.findFirst({
        where: {
          dia_dia_codigo: marcacion_hora.getDay().toString(),
          dia_estado: 'ACTIVE'
        },
      });

      let his = await this.prisma.mar_his_historial.findFirst({
        where: {
          his_codasi: empAsig.asi_codigo,
          his_hora_salida: null,
          emp_estado: 'ACTIVE',
        },
      });
      let respApi;
      let horDetail = await this.prisma.mar_hde_detalle_ho.findFirst({
        where: {
          hde_coddia: days.dia_codigo,
          hde_codhor: empAsig.mar_hor_horarios.hor_codigo,
          hde_estado: 'ACTIVE'
        },
        include: {
          mar_dia_dias: true
        }
      });
      let h_inicio1 = horDetail.hde_inicio_1.split(":");
      let inicio_1;
      if (h_inicio1.length > 1) {
        inicio_1 = this.getDate(h_inicio1[0], h_inicio1[1]);
      }
      if (his) {
        let h_fin1 = horDetail.hde_fin_1.split(":");
        let fin_1;
        if (h_fin1.length > 1) {
          fin_1 = this.getDate(h_fin1[0], h_fin1[1]);
        }
        let h_inicio2 = horDetail.hde_inicio_2.split(":");
        let inicio_2;
        if (h_inicio2.length > 1) {
          inicio_2 = this.getDate(h_inicio2[0], h_inicio2[1]);
        }
        let h_fin2 = horDetail.hde_fin_2.split(":");
        let fin_2;
        if (h_fin2.length > 1) {
          fin_2 = this.getDate(h_fin2[0], h_fin2[1]);
        }
        let horas_deber_cumplir = 0;
        if (inicio_1 != null && fin_1 != null) {
          horas_deber_cumplir = this.calcularHorasEntreFechas(inicio_1, fin_1);
        }
        let diferenAlSalir =0;
        if (fin_1 != null) {
            diferenAlSalir = this.diferenciaEnMinutos(fin_1, marcacion_hora);
        }

        let hora = his.his_hora_entrada;
        let start_date = new Date(marcacion_hora.getFullYear(), marcacion_hora.getMonth(), marcacion_hora.getDate(), hora.getHours(), hora.getMinutes());
        let end_date = new Date(marcacion_hora.getFullYear(), marcacion_hora.getMonth(), marcacion_hora.getDate(), marcacion_hora.getHours(), marcacion_hora.getMinutes());
        let horas_trabajadas = this.calcularHorasEntreFechas(start_date, end_date);
        let his_tp_extra = (horas_deber_cumplir > 0 ? (horas_trabajadas - horas_deber_cumplir) : 0);
        let datos = {
          his_hora_salida: marcacion_hora,
          his_tp_trabajado: horas_trabajadas.toFixed(2),
          his_tp_extra: (his_tp_extra > 0 ? his_tp_extra : 0).toString(),
          his_usrmod: employe.emp_nombres + ' ' + employe.emp_apellidos,
          his_codasi: empAsig.asi_codigo,
          his_salida_temp: diferenAlSalir > 10,
        };
        respApi = await this.prisma.mar_his_historial.update({
          where: { his_codigo: his.his_codigo, emp_estado: 'ACTIVE' },
          data: datos,
        });
      } else {
        let diferenAlEntrar = 0;
        if (inicio_1 != null) {
          diferenAlEntrar = this.diferenciaEnMinutos(marcacion_hora, inicio_1);
        }
        let data = {
          his_hora_entrada: marcacion_hora,
          his_entrada_tarde: diferenAlEntrar > 10,
          his_hora_salida: null,
          his_tp_trabajado: '0',
          his_tp_extra: '0',
          his_usrcrea: employe.emp_nombres + ' ' + employe.emp_apellidos,
          his_usrmod: employe.emp_nombres + ' ' + employe.emp_apellidos,
          his_codasi: empAsig.asi_codigo,
        };
        respApi = await this.prisma.mar_his_historial.create({
          data,
        });
      }
      return {
        empleado: employe.emp_nombres + ' ' + employe.emp_apellidos,
        hora: this.formatAMPM(marcacion_hora),
      };
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException('Ha ocurrido un error al marcar, favor intentar de nuevo');
    }
  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  calcularHorasEntreFechas(fechaInicial: Date, fechaFinal: Date): number {
    // Diferencia en milisegundos
    const diferencia = fechaFinal.getTime() - fechaInicial.getTime();

    // Convertir milisegundos en horas
    const horas = diferencia / (1000 * 60 * 60);

    return horas;
  }

  diferenciaEnMinutos(fechaInicial: Date, fechaFinal: Date): number {
    // Calcular la diferencia en milisegundos
    const diferencia = fechaInicial.getTime() - fechaFinal.getTime();
    // Convertir milisegundos a minutos
    return Math.abs(diferencia / 60000);
  }


  async obtenerDatos(path): Promise<any> {
    try {
      let path_ = `${this.configService.get('URL_PYTHON')}/${path}`;
      const respuesta: AxiosResponse = await axios.get(path_);
      if (respuesta.status == 200) {
        return respuesta.data.persona;
      } else {
        return "Error al procesar la imagen";
      }
    } catch (error) {
      return "Error al procesar la imagen";
      // throw new Error(`Error al obtener datos: ${error.message}`);
    }
  }

  getDate(hora: string = '00', minutos: string = '00') {
    let date = new Date();
    let retrunDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Number(hora),
      Number(minutos),
    );
    return retrunDate;
  }
}
