import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarkingDto } from './dto/create-marking.dto';
import { UpdateMarkingDto } from './dto/update-marking.dto';
import { PrismaService } from 'src/common/services';
import { FilterDTO } from './dto/filter.dto';
import {
  TimeType,
  convert_date,
  calculateDaysBetweenDates,
  areDatesEqual,
  formatDateInSpanish,
} from 'src/common/helpers';

import * as Excel from 'exceljs';
import { StatusDTO } from './dto/status.dto';

@Injectable()
export class MarkingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMarkingDto: CreateMarkingDto) {
    return 'This action adds a new marking';
  }
  async updateAllExtraHours(id: string, statusDTO: StatusDTO) {
    let data = await this.prisma.mar_his_historial.update({
      data: {
        his_tp_extra_apro: statusDTO.status,
      },
      where: {
        his_codigo: id,
      },
    });
    return data;
  }

  async getAllExtraHours(id: string) {
    let date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let respDB = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: id,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          where: {
            asi_estado: 'ACTIVE',
          },
          include: {
            mar_emp_empleados: {
              include: {
                mar_con_contrataciones: true,
                mar_ubi_ubicaciones: true,
              },
            },
            mar_his_historial: {
              where: {
                his_feccrea: {
                  gte: startDate,
                  lte: endDate,
                },
                emp_estado: 'ACTIVE',
                his_tp_extra: {
                  not: '0',
                },
              },
            },
          },
        },
      },
    });

    let porProcesar = [];
    let validadas = [];
    let rechazadas = [];

    for (let iDB = 0; iDB < respDB.length; iDB++) {
      const dbRow = respDB[iDB];
      for (let index = 0; index < dbRow.mar_asi_asignacion.length; index++) {
        const element = dbRow.mar_asi_asignacion[index];
        for (let iHis = 0; iHis < element.mar_his_historial.length; iHis++) {
          const historial = element.mar_his_historial[iHis];
          if (!(parseInt(historial.his_tp_extra) > 0)) {
            continue;
          }
          let item = {
            ...historial,
            nombre: element.mar_emp_empleados.emp_nombres,
            apellidos: element.mar_emp_empleados.emp_apellidos,
            tipo_contratacion:
              element.mar_emp_empleados.mar_con_contrataciones.con_nombre,
            sede: element.mar_emp_empleados.mar_ubi_ubicaciones.ubi_nombre,
            codigo_empleado: element.mar_emp_empleados.emp_codigo_emp,
          };
          if (historial.his_tp_extra_apro == 'PENDIENTE') {
            porProcesar.push(item);
          }

          if (historial.his_tp_extra_apro == 'APROBADO') {
            validadas.push(item);
          }

          if (historial.his_tp_extra_apro == 'RECHAZADO') {
            rechazadas.push(item);
          }
        }
      }
    }

    return { porProcesar, validadas, rechazadas };
  }

  async getAllMarkings(id: string, filterDTO: FilterDTO) {
    let startDate = convert_date(filterDTO.date_start, TimeType.Inicio);
    let endDate = convert_date(filterDTO.date_end, TimeType.Fin);
    let data = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: id,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          orderBy: {
            asi_codemp: 'asc',
          },
          where: {
            asi_estado: 'ACTIVE',
          },
          select: {
            asi_codigo: true,
            mar_his_historial: {
              where: {
                his_feccrea: {
                  gte: startDate, // Mayor o igual que startDate
                  lte: endDate,
                },
              },
              orderBy: {
                his_feccrea: 'asc',
              },
            },
            mar_emp_empleados: {
              include: {
                mar_ubi_ubicaciones: true,
              },
            },
          },
        },
        mar_hde_detalle_ho: {
          where: { hde_estado: 'ACTIVE' },
        },
      },
    });
    let dataResp = [];
    for (let index = 0; index < data.length; index++) {
      const horarios = data[index];
      for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
        const asig = horarios.mar_asi_asignacion[e];
        if (asig.mar_his_historial.length == 0) {
          continue;
        }
        for (let a = 0; a < asig.mar_his_historial.length; a++) {
          const hora = asig.mar_his_historial[a];
          let registro = {
            nombres: asig.mar_emp_empleados.emp_nombres,
            apellidos: asig.mar_emp_empleados.emp_apellidos,
            codigo: asig.mar_emp_empleados.emp_codigo_emp,
            id: asig.mar_emp_empleados.emp_codigo,
            fecha: hora.his_feccrea,
            entrada: hora.his_hora_entrada,
            entrada_tardia: hora.his_entrada_tarde,
            salida: hora.his_hora_salida,
            salida_temprana: hora.his_salida_temp,
            tiempo_extra: hora.his_tp_extra,
            tiempo_trabajado: hora.his_tp_trabajado,
            sede: asig.mar_emp_empleados.mar_ubi_ubicaciones.ubi_nombre,
          };
          dataResp.push(registro);
        }
      }
    }
    return dataResp;
  }

  async excelAllMarkings(id: string, filterDTO: FilterDTO) {
    let font = {
      name: 'Arial Black',
      color: { argb: 'FF000000' },
      size: 16,
    };
    let contrats = await this.prisma.mar_ctr_contratos.findUnique({
      where: { ctr_codigo: id, ctr_estado: 'ACTIVE' },
    });
    if (!contrats) throw new NotFoundException(`Regisro no encontrado`);

    let startDate = convert_date(filterDTO.date_start, TimeType.Inicio);
    let endDate = convert_date(filterDTO.date_end, TimeType.Fin);
    const workbook = new Excel.Workbook();
    workbook.creator = 'CEL';
    workbook.lastModifiedBy = 'CEL - Marcaciones';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    const worksheet = workbook.addWorksheet('Marcaciones');
    worksheet.mergeCells('A2:AG2');
    worksheet.getCell('AG2').value = contrats.ctr_nombre;
    worksheet.getCell('AG2').font = font;
    worksheet.getCell('AG2').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells('A3:AG3');
    worksheet.getCell('AG3').value = 'Contrato: ' + contrats.ctr_num_contrato;
    worksheet.getCell('AG3').font = font;
    worksheet.getCell('AG3').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells('A4:AG4');
    worksheet.getCell('AG4').value =
      'Control de asistencia diaria del personal correspondiente al período ' +
      formatDateInSpanish(startDate) +
      '  al ' +
      formatDateInSpanish(endDate);
    worksheet.getCell('AG4').font = font;
    worksheet.getCell('AG4').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells('A5:AG5');
    worksheet.getCell('AG5').value = ' ';
    worksheet.getCell('AG5').font = font;
    worksheet.getCell('AG5').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    // Guardar en un buffer
    let data = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: id,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          orderBy: {
            mar_emp_empleados: {
              emp_apellidos: 'asc',
            },
          },
          where: {
            asi_estado: 'ACTIVE',
          },
          select: {
            asi_codigo: true,
            mar_his_historial: {
              where: {
                his_feccrea: {
                  gte: startDate, // Mayor o igual que startDate
                  lte: endDate,
                },
              },
              orderBy: {
                his_feccrea: 'asc',
              },
            },
            mar_emp_empleados: true,
          },
        },
        mar_hde_detalle_ho: {
          where: { hde_estado: 'ACTIVE' },
        },
      },
    });
    let fontheader = {
      name: 'Arial Black',
      color: { argb: 'FF000000' },
    };
    worksheet.getCell('A7').value = 'Cod';
    worksheet.getCell('A7').font = fontheader;
    worksheet.getCell('A7').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getCell('B7').value = 'Nombre';
    worksheet.getCell('B7').font = fontheader;
    worksheet.getCell('B7').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    let daysSelect = calculateDaysBetweenDates(startDate, endDate);
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    daysSelect = daysSelect + 2;
    const row = worksheet.getRow(7);
    let lastColum = 0;
    for (let index = 3; index <= daysSelect; index++) {
      lastColum = index;
      const dobCol = worksheet.getColumn(index);
      dobCol.width = 5;
      let dayDate = startDate;
      // Sumar los días
      row.getCell(index).value = dayDate.getDate().toString();
      row.getCell(index).font = fontheader;
      row.getCell(index).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      dayDate.setDate(dayDate.getDate() + 1);
    }
    lastColum++;
    row.getCell(lastColum).value = 'Firma del\nEmpleado';
    row.getCell(lastColum).font = fontheader;
    row.getCell(lastColum).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getColumn(lastColum).width = 20;

    let startRow = 8;
    for (let index = 0; index < data.length; index++) {
      const horarios = data[index];
      for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
        const asig = horarios.mar_asi_asignacion[e];
        if (asig.mar_his_historial.length == 0) continue;
        worksheet.getCell('A' + startRow).value =
          asig.mar_emp_empleados.emp_codigo_emp;
        worksheet.getCell('A' + startRow).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
        worksheet.getCell('B' + startRow).value =
          asig.mar_emp_empleados.emp_apellidos +
          ', ' +
          asig.mar_emp_empleados.emp_nombres;

        const row = worksheet.getRow(startRow);
        let dayDateEmp = convert_date(filterDTO.date_start, TimeType.Inicio);
        for (let ie = 3; ie <= daysSelect; ie++) {
          row.getCell(ie).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          row.getCell(ie).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          row.getCell(ie).value = '';
          for (
            let iHistorial = 0;
            iHistorial < asig.mar_his_historial.length;
            iHistorial++
          ) {
            const histial = asig.mar_his_historial[iHistorial];
            let isCorrectDay = areDatesEqual(dayDateEmp, histial.his_feccrea);
            if (isCorrectDay) {
              row.getCell(ie).value = 'X';
              // row.getCell(ie).fill = {
              //   type: 'pattern',
              //   pattern: 'solid',
              //   fgColor: { argb: 'FF92D050' },
              // };
              break;
            }
          }

          dayDateEmp.setDate(dayDateEmp.getDate() + 1);
        }

        startRow++;
      }

      worksheet.getCell('B' + (startRow + 1)).value = 'A: Asueto';

      worksheet.getCell('B' + (startRow + 1)).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      worksheet.getCell('B' + (startRow + 2)).value = 'D: Descanso';
      worksheet.getCell('B' + (startRow + 3)).value = 'F: Falta (Sin permiso)';
      worksheet.getCell('B' + (startRow + 4)).value = 'I: Incapacidad';
      worksheet.getCell('B' + (startRow + 4)).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFffff00' },
      };
      worksheet.getCell('B' + (startRow + 5)).value = 'P: Permiso';
      worksheet.getCell('B' + (startRow + 5)).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF92D050' },
      };
      worksheet.getCell('B' + (startRow + 6)).value = 'V: Vacación';
      worksheet.getCell('B' + (startRow + 6)).value = 'X: Asistencia';
    }

    // let dataResp = [];
    // for (let index = 0; index < data.length; index++) {
    //   const horarios = data[index];
    //   for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
    //     const asig = horarios.mar_asi_asignacion[e];
    //     if (asig.mar_his_historial.length == 0) {
    //       continue;
    //     }
    //     for (let a = 0; a < asig.mar_his_historial.length; a++) {
    //       const hora = asig.mar_his_historial[a];
    //       let registro = {
    //         nombres: asig.mar_emp_empleados.emp_nombres,
    //         apellidos: asig.mar_emp_empleados.emp_apellidos,
    //         codigo: asig.mar_emp_empleados.emp_codigo_emp,
    //         id: asig.mar_emp_empleados.emp_codigo,
    //         fecha: hora.his_feccrea,
    //         entrada: hora.his_hora_entrada,
    //         salida: hora.his_hora_salida,
    //         tiempo_extra: hora.his_tp_extra,
    //         tiempo_trabajado: hora.his_tp_trabajado,
    //       }
    //       dataResp.push(registro);
    //     }
    //   }
    // }
    // return dataResp;

    return await workbook.xlsx.writeBuffer();
  }

  findOne(id: number) {
    return `This action returns a #${id} marking`;
  }

  update(id: number, updateMarkingDto: UpdateMarkingDto) {
    return `This action updates a #${id} marking`;
  }

  remove(id: number) {
    return `This action removes a #${id} marking`;
  }
}
