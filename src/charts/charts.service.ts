import { Injectable, NotFoundException } from '@nestjs/common';
import { mar_ctr_contratos } from '@prisma/client';
import { PrismaService } from 'src/common/services';

@Injectable()
export class ChartsService {
  constructor(private readonly prisma: PrismaService) {}

  async getChartsContract(codigo: string) {
    const contract = await this.prisma.mar_ctr_contratos.findFirst({
      where: {
        ctr_codigo: codigo,
        ctr_estado: 'ACTIVE',
      },
    });
    if (!contract) throw new NotFoundException(`Regisro no encontrado`);
    let [genders, contrations, extraHours, time, months] = await Promise.all([
      this.getChartsGenderContract(contract),
      this.getChartsContrationContract(contract),
      this.getCountHourExtrContract(contract),
      this.getCountLatesContract(contract),
      this.getCountXMonthContract(contract),
    ]);
    return { genders, contrations, extraHours, time, months };
  }

  async getCountLatesContract(contract: mar_ctr_contratos) {
    let date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const ultimoDia = new Date(date.getFullYear(), date.getMonth(), 0);
    const respDb = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_estado: 'ACTIVE',
        hor_codctro: contract.ctr_codigo,
      },
      include: {
        mar_asi_asignacion: {
          where: {
            asi_estado: 'ACTIVE',
          },
          include: {
            mar_his_historial: {
              where: {
                emp_estado: 'ACTIVE',
                his_feccrea: {
                  gte: startDate, // Mayor o igual que startDate
                  lte: ultimoDia,
                },
              },
            },
          },
        },
      },
    });
    let inLate = 0;
    let onTime = 0;
    let total = 0;
    for (let iHorarios = 0; iHorarios < respDb.length; iHorarios++) {
      const horario = respDb[iHorarios];
      for (
        let iAsignacion = 0;
        iAsignacion < horario.mar_asi_asignacion.length;
        iAsignacion++
      ) {
        const asig = horario.mar_asi_asignacion[iAsignacion];
        for (let iHis = 0; iHis < asig.mar_his_historial.length; iHis++) {
          total++;
          const historial = asig.mar_his_historial[iHis];
          if (historial.his_entrada_tarde) {
            inLate++;
          } else {
            onTime++;
          }
        }
      }
    }
    return { inLate, onTime, total };
  }

  async getCountXMonthContract(contract: mar_ctr_contratos) {
    let date = new Date();
    let months = [];
    for (let index = 1; index <= 12; index++) {
      const startDate = new Date(date.getFullYear(), index - 1, 1, 1, 0, 0);
      const ultimoDia = new Date(date.getFullYear(), index, 0, 23, 59, 59, 999); 
      const respDb = await this.prisma.mar_hor_horarios.findMany({
        where: {
          hor_estado: 'ACTIVE',
          hor_codctro: contract.ctr_codigo,
        },
        include: {
          mar_asi_asignacion: {
            where: {
              asi_estado: 'ACTIVE',
            },
            include: {
              mar_his_historial: {
                where: {
                  emp_estado: 'ACTIVE',
                  his_feccrea: {
                    gte: startDate, // Mayor o igual que startDate
                    lte: ultimoDia,
                  },
                },
              },
            },
          },
        },
      });
      let inLate = 0;
      let onTime = 0;
      let total = 0;
      for (let iHorarios = 0; iHorarios < respDb.length; iHorarios++) {
        const horario = respDb[iHorarios];
        for (
          let iAsignacion = 0;
          iAsignacion < horario.mar_asi_asignacion.length;
          iAsignacion++
        ) {
          const asig = horario.mar_asi_asignacion[iAsignacion];
          for (let iHis = 0; iHis < asig.mar_his_historial.length; iHis++) {
            total++;
            const historial = asig.mar_his_historial[iHis];
            if (historial.his_entrada_tarde) {
              inLate++;
            } else {
              onTime++;
            }
          }
        }
      }
      let month = startDate.toLocaleString('es-ES', { month: 'long' });
      months.push({ inLate, onTime, total, month, index });
    }
    return months;
  }
  async getCountHourExtrContract(contract: mar_ctr_contratos) {
    let date = new Date();
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1,
      0,
      0,
    );
    const ultimoDia = new Date(
      date.getFullYear(),
      date.getMonth(),
      0,
      23,
      59,
      59,
      59,
    );
    let respDb = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_estado: 'ACTIVE',
        hor_codctro: contract.ctr_codigo,
      },
      include: {
        mar_asi_asignacion: {
          where: {
            asi_estado: 'ACTIVE',
          },
          include: {
            mar_his_historial: {
              where: {
                his_feccrea: {
                  gte: startDate, // Mayor o igual que startDate
                  lte: ultimoDia,
                },
                emp_estado: 'ACTIVE',
              },
            },
          },
        },
      },
    });
    let extraHours = 0;
    for (let iHorarios = 0; iHorarios < respDb.length; iHorarios++) {
      const horario = respDb[iHorarios];
      for (
        let iAsignacion = 0;
        iAsignacion < horario.mar_asi_asignacion.length;
        iAsignacion++
      ) {
        const asig = horario.mar_asi_asignacion[iAsignacion];
        for (let iHis = 0; iHis < asig.mar_his_historial.length; iHis++) {
          const historial = asig.mar_his_historial[iHis];
          extraHours = extraHours + parseInt(historial.his_tp_extra);
        }
      }
    }
    return { extraHours, extraHoursC: contract.ctr_horas_extras };
  }

  async getChartsGenderContract(contract: mar_ctr_contratos) {
    const empleadosList = await this.prisma.mar_hor_horarios.findMany({
      where: {
        hor_codctro: contract.ctr_codigo,
        hor_estado: 'ACTIVE',
      },
      include: {
        mar_asi_asignacion: {
          where: {
            asi_estado: 'ACTIVE',
          },
        },
      },
    });

    const genders = await this.prisma.mar_gen_generos.findMany({
      where: { gen_estado: 'ACTIVE' },
    });
    const resGender = await Promise.all(
      genders.map(async (grupo) => {
        const empleados = await this.prisma.mar_emp_empleados.aggregate({
          _count: {
            emp_codgen: true,
          },
          where: {
            emp_codgen: grupo.gen_codigo,
            emp_estado: 'ACTIVE',
          },
        });

        return {
          nombre: grupo.gen_nombre,
          cantidad: empleados._count.emp_codgen,
        };
      }),
    );
    return resGender;
  }

  async getChartsContrationContract(contract: mar_ctr_contratos) {
    const contrations = await this.prisma.mar_con_contrataciones.findMany({
      where: { con_estado: 'ACTIVE' },
    });
    const resGender = await Promise.all(
      contrations.map(async (grupo) => {
        const empleados = await this.prisma.mar_emp_empleados.aggregate({
          _count: {
            emp_codgen: true,
          },
          where: {
            emp_codcon: grupo.con_codigo,
            emp_estado: 'ACTIVE',
          },
        });
        return {
          nombre: grupo.con_nombre,
          cantidad: empleados._count.emp_codgen,
        };
      }),
    );
    return resGender;
  }
}
