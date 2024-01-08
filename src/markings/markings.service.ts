import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarkingDto } from './dto/create-marking.dto';
import { UpdateMarkingDto } from './dto/update-marking.dto';
import { PrismaService } from 'src/common/services';
import { FilterDTO } from './dto/filter.dto';
import { TimeType, convert_date, calculateDaysBetweenDates, areDatesEqual, formatDateInSpanish } from 'src/common/helpers';

import * as Excel from 'exceljs';

@Injectable()
export class MarkingsService {


  constructor(private readonly prisma: PrismaService) { }

  create(createMarkingDto: CreateMarkingDto) {
    return 'This action adds a new marking';
  }

  async getAllMarkings(id: string, filterDTO: FilterDTO) {

    var startDate = convert_date(filterDTO.date_start, TimeType.Inicio);
    var endDate = convert_date(filterDTO.date_end, TimeType.Fin);
    var data = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: id,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          orderBy: {
            asi_codemp: 'asc'
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
                  lte: endDate
                }
              },
              orderBy: {
                his_feccrea: 'asc'
              }
            },
            mar_emp_empleados: true
          }
        },
        mar_hde_detalle_ho: {
          where: { hde_estado: 'ACTIVE' },
        }
      }
    });
    var dataResp = [];
    for (let index = 0; index < data.length; index++) {
      const horarios = data[index];
      for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
        const asig = horarios.mar_asi_asignacion[e];
        if (asig.mar_his_historial.length == 0) {
          continue;
        }
        for (let a = 0; a < asig.mar_his_historial.length; a++) {
          const hora = asig.mar_his_historial[a];
          var registro = {
            nombres: asig.mar_emp_empleados.emp_nombres,
            apellidos: asig.mar_emp_empleados.emp_apellidos,
            codigo: asig.mar_emp_empleados.emp_codigo_emp,
            id: asig.mar_emp_empleados.emp_codigo,
            fecha: hora.his_feccrea,
            entrada: hora.his_hora_entrada,
            salida: hora.his_hora_salida,
            tiempo_extra: hora.his_tp_extra,
            tiempo_trabajado: hora.his_tp_trabajado,
          }
          dataResp.push(registro);
        }
      }
    }
    return dataResp;
  }


  async excelAllMarkings(id: string, filterDTO: FilterDTO) {
    var font = {
      name: 'Arial Black',
      color: { argb: 'FF000000' },
      size: 16,
    };
    var contrats = await this.prisma.mar_ctr_contratos.findUnique({
      where: { ctr_codigo: id, ctr_estado: 'ACTIVE' }
    });
    if (!contrats) throw new NotFoundException(`Regisro no encontrado`);

    var startDate = convert_date(filterDTO.date_start, TimeType.Inicio);
    var endDate = convert_date(filterDTO.date_end, TimeType.Fin);
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
    worksheet.getCell('AG2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:AG3');
    worksheet.getCell('AG3').value = 'Contrato: '+contrats.ctr_num_contrato;
    worksheet.getCell('AG3').font = font;
    worksheet.getCell('AG3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A4:AG4');
    worksheet.getCell('AG4').value = 'Control de asistencia diaria del personal correspondiente al período '+formatDateInSpanish(startDate)+'  al '+formatDateInSpanish(endDate);
    worksheet.getCell('AG4').font = font;
    worksheet.getCell('AG4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A5:AG5');
    worksheet.getCell('AG5').value = ' ';
    worksheet.getCell('AG5').font = font;
    worksheet.getCell('AG5').alignment = { vertical: 'middle', horizontal: 'center' };

    // Guardar en un buffer 
    var data = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: id,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          orderBy: {
            asi_codemp: 'asc'
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
                  lte: endDate
                }
              },
              orderBy: {
                his_feccrea: 'asc'
              }
            },
            mar_emp_empleados: true
          }
        },
        mar_hde_detalle_ho: {
          where: { hde_estado: 'ACTIVE' },
        }
      }
    });
    var fontheader = {
      name: 'Arial Black',
      color: { argb: 'FF000000' },
    };
    worksheet.getCell('A7').value = 'Cod';
    worksheet.getCell('A7').font = fontheader;
    worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B7').value = 'Nombre';
    worksheet.getCell('B7').font = fontheader;
    worksheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'center' };
    var daysSelect = calculateDaysBetweenDates(startDate, endDate);
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    daysSelect = daysSelect + 2;
    const row = worksheet.getRow(7);
    var lastColum = 0;
    for (let index = 3; index <= daysSelect; index++) {
      lastColum = index;
      const dobCol = worksheet.getColumn(index);
      dobCol.width = 5;
      var dayDate = startDate;
      // Sumar los días
      row.getCell(index).value = dayDate.getDate().toString();
      row.getCell(index).font = fontheader;
      row.getCell(index).alignment = { vertical: 'middle', horizontal: 'center' };
      dayDate.setDate(dayDate.getDate() + 1);

    }
    lastColum++;
    row.getCell(lastColum).value = "Firma del\nEmpleado";
    row.getCell(lastColum).font = fontheader;
    row.getCell(lastColum).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn(lastColum).width = 20;

    var startRow = 8;
    for (let index = 0; index < data.length; index++) {
      const horarios = data[index];
      for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
        const asig = horarios.mar_asi_asignacion[e];
        if (asig.mar_his_historial.length == 0) continue;
        worksheet.getCell('A' + startRow).value = asig.mar_emp_empleados.emp_codigo_emp;
        worksheet.getCell('A' + startRow).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('B' + startRow).value = asig.mar_emp_empleados.emp_nombres + ' ' + asig.mar_emp_empleados.emp_apellidos;

        const row = worksheet.getRow(startRow);
        var dayDateEmp = convert_date(filterDTO.date_start, TimeType.Inicio);
        for (let ie = 3; ie <= daysSelect; ie++) {
          // Sumar los días 
          row.getCell(ie).font = fontheader;
          row.getCell(ie).alignment = { vertical: 'middle', horizontal: 'center' };

          row.getCell(ie).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          row.getCell(ie).value = '';
          for (let iHistorial = 0; iHistorial < asig.mar_his_historial.length; iHistorial++) {
            const histial = asig.mar_his_historial[iHistorial];
            var isCorrectDay = areDatesEqual(dayDateEmp, histial.his_feccrea);
            if (isCorrectDay) {
              row.getCell(ie).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF92D050' },
              };
              break;
            }

          }

          dayDateEmp.setDate(dayDateEmp.getDate() + 1);
        }

        startRow++;
      }


      worksheet.getCell('B' + (startRow+1)).value = "A: Asueto";

      worksheet.getCell('B' + (startRow+1)).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      worksheet.getCell('B' + (startRow+2)).value = "D: Descanso";
      worksheet.getCell('B' + (startRow+3)).value = "F: Falta (Sin permiso)";
      worksheet.getCell('B' + (startRow+4)).value = "I: Incapacidad";
      worksheet.getCell('B' + (startRow+4)).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFffff00' },
      };
      worksheet.getCell('B' + (startRow+5)).value = "P: Permiso";
      worksheet.getCell('B' + (startRow+5)).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF92D050' },
      };
      worksheet.getCell('B' + (startRow+6)).value = "V: Vacación";
      worksheet.getCell('B' + (startRow+6)).value = "X: Asistencia";

    }

    // var dataResp = [];
    // for (let index = 0; index < data.length; index++) {
    //   const horarios = data[index];
    //   for (let e = 0; e < horarios.mar_asi_asignacion.length; e++) {
    //     const asig = horarios.mar_asi_asignacion[e];
    //     if (asig.mar_his_historial.length == 0) {
    //       continue;
    //     }
    //     for (let a = 0; a < asig.mar_his_historial.length; a++) {
    //       const hora = asig.mar_his_historial[a];
    //       var registro = {
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
