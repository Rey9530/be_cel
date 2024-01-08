import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services';

@Injectable()
export class ChartsService {

    constructor(private readonly prisma: PrismaService) { }

    async getChartsContract(codigo: string) {
        var [genders, contrations] = await Promise.all([
            this.getChartsGenderContract(codigo),
            this.getChartsContrationContract(codigo),
        ]);
        return { genders, contrations };
    }
    async getChartsGenderContract(codigo: string) {
        const contract = await this.prisma.mar_ctr_contratos.findFirst({
            where: {
                ctr_codigo: codigo,
                ctr_estado: 'ACTIVE'
            }
        });
        if (!contract) throw new NotFoundException(`Regisro no encontrado`);
        const empleadosList = await this.prisma.mar_hor_horarios.findMany({
            where: {
                hor_codctro: codigo,
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


    async getChartsContrationContract(codigo: string) {
        const contract = await this.prisma.mar_ctr_contratos.findFirst({
            where: {
                ctr_codigo: codigo,
                ctr_estado: 'ACTIVE'
            }
        });
        if (!contract) throw new NotFoundException(`Regisro no encontrado`);
        const empleadosList = await this.prisma.mar_hor_horarios.findMany({
            where: {
                hor_codctro: codigo,
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
