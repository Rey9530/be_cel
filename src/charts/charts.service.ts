import { Injectable, NotFoundException } from '@nestjs/common';
import { mar_ctr_contratos } from '@prisma/client';
import { PrismaService } from 'src/common/services';

@Injectable()
export class ChartsService {

    constructor(private readonly prisma: PrismaService) { }

    async getChartsContract(codigo: string) {
        const contract = await this.prisma.mar_ctr_contratos.findFirst({
            where: {
                ctr_codigo: codigo,
                ctr_estado: 'ACTIVE'
            }
        });
        var [genders, contrations, extraHours, time] = await Promise.all([
            this.getChartsGenderContract(contract),
            this.getChartsContrationContract(contract),
            this.getCountHourExtrContract(contract),
            this.getCountLatesContract(contract),
        ]);
        return { genders, contrations, extraHours, time };
    }

    async getCountLatesContract(contract: mar_ctr_contratos) { 

        const respDb = await this.prisma.mar_hor_horarios.findMany({
            where: {
                hor_estado: 'ACTIVE',
                hor_codctro: contract.ctr_codigo,
            },
            include: {
                mar_asi_asignacion: {
                    where: {
                        asi_estado: 'ACTIVE'
                    },
                    include: {
                        mar_his_historial: {
                            where: {
                                emp_estado: 'ACTIVE'
                            }
                        }
                    }
                }
            }
        });
        var inLate = 0;
        var onTime = 0;
        var total = 0;
        for (let iHorarios = 0; iHorarios < respDb.length; iHorarios++) {
            const horario = respDb[iHorarios];
            for (let iAsignacion = 0; iAsignacion < horario.mar_asi_asignacion.length; iAsignacion++) {
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
    async getCountHourExtrContract(contract: mar_ctr_contratos) {
        var respDb = await this.prisma.mar_hor_horarios.findMany({
            where: {
                hor_estado: 'ACTIVE',
                hor_codctro: contract.ctr_codigo,
            },
            include: {
                mar_asi_asignacion: {
                    where: {
                        asi_estado: 'ACTIVE'
                    },
                    include: {
                        mar_his_historial: true
                    }
                }
            }
        });
        var extraHours = 0;
        for (let iHorarios = 0; iHorarios < respDb.length; iHorarios++) {
            const horario = respDb[iHorarios];
            for (let iAsignacion = 0; iAsignacion < horario.mar_asi_asignacion.length; iAsignacion++) {
                const asig = horario.mar_asi_asignacion[iAsignacion];
                for (let iHis = 0; iHis < asig.mar_his_historial.length; iHis++) {
                    const historial = asig.mar_his_historial[iHis];
                    extraHours = extraHours + parseInt(historial.his_tp_extra);
                }
            }

        }
        return { extraHours, extraHoursC: contract.ctr_horas_extras, };
    }

    async getChartsGenderContract(contract: mar_ctr_contratos) {
        if (!contract) throw new NotFoundException(`Regisro no encontrado`);
        const empleadosList = await this.prisma.mar_hor_horarios.findMany({
            where: {
                hor_codctro: contract.ctr_codigo,
                hor_estado: 'ACTIVE'
            },
            include: {
                mar_asi_asignacion: {
                    where: {
                        asi_estado: 'ACTIVE'
                    }
                },
            }
        });

        var wEmpleados = [];
        for (let i_empleado = 0; i_empleado < empleadosList.length; i_empleado++) {
            const element = empleadosList[i_empleado];
            wEmpleados.push({
                emp_codigo: element.hor_codigo
            });
        }
        const genders = await this.prisma.mar_gen_generos.findMany({ where: { gen_estado: 'ACTIVE' } });
        const resGender = await Promise.all(genders.map(async (grupo) => {

            const empleados = await this.prisma.mar_emp_empleados.aggregate({
                _count: {
                    emp_codgen: true,
                },
                where: {
                    emp_codgen: grupo.gen_codigo,
                    emp_estado: 'ACTIVE'
                }
            })

            return {
                nombre: grupo.gen_nombre,
                cantidad: empleados._count.emp_codgen,
            };
        }));
        return resGender;

    }


    async getChartsContrationContract(contract: mar_ctr_contratos) {
        if (!contract) throw new NotFoundException(`Regisro no encontrado`);
        const empleadosList = await this.prisma.mar_hor_horarios.findMany({
            where: {
                hor_codctro: contract.ctr_codigo,
                hor_estado: 'ACTIVE'
            },
        });

        var wEmpleados = [];
        for (let i_empleado = 0; i_empleado < empleadosList.length; i_empleado++) {
            const element = empleadosList[i_empleado];
            wEmpleados.push({
                emp_codigo: element.hor_codigo
            });
        }
        const contrations = await this.prisma.mar_con_contrataciones.findMany({ where: { con_estado: 'ACTIVE' } });
        const resGender = await Promise.all(contrations.map(async (grupo) => {

            const empleados = await this.prisma.mar_emp_empleados.aggregate({
                _count: {
                    emp_codgen: true,
                },
                where: {
                    emp_codcon: grupo.con_codigo,
                    emp_estado: 'ACTIVE'
                }
            })

            return {
                nombre: grupo.con_nombre,
                cantidad: empleados._count.emp_codgen,
            };
        }));
        return resGender;

    }
}
