import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly prisma: PrismaService) { }
  async deleteSeed() {
    await this.prisma.mar_emp_empleados.deleteMany();
    await this.prisma.mar_epr_empresas.deleteMany();
    await this.prisma.mar_usr_usuario.deleteMany();
    await this.prisma.mar_gen_generos.deleteMany();
    await this.prisma.mar_ubi_ubicaciones.deleteMany();
    await this.prisma.mar_con_contrataciones.deleteMany();
    await this.prisma.mar_dia_dias.deleteMany();
  }

  async executeSeed() {
    try {
      await this.deleteSeed();
      var cremod = 'Creado por el seeder';
      await this.prisma.mar_ubi_ubicaciones.createMany({
        data: [
          {
            ubi_nombre: 'Central hidroeléctrica Guajoyo',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Central hidroeléctrica Cerrón Grande',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Central hidroeléctrica 5 de Noviembre',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Central hidroeléctrica 15 de Septiembre',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Central Hidroeléctrica 3 de Febrero',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Centro de Atención a Primera Infancia (CAPI)',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Oficina Central',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Almacén Central San Ramón',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Centro Social Costa CEL',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
          {
            ubi_nombre: 'Maquinaria y Equipo pesado (Albergue de Jiquilisco)',
            ubi_usrcrea: cremod,
            ubi_usrmod: cremod,
          },
        ],
      });
      var gender = await this.prisma.mar_gen_generos.create({
        data: {
          gen_nombre: 'Masculino',
          gen_usrcrea: cremod,
          gen_usrmod: cremod,
        },
      });

      await this.prisma.mar_gen_generos.create({
        data: {
          gen_nombre: 'Femenino',
          gen_usrcrea: cremod,
          gen_usrmod: cremod,
        },
      });

      await this.prisma.mar_dia_dias.createMany({
        data: [
          {
            dia_nombre: 'Domingo',
            dia_dia_codigo: '0',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
          {
            dia_nombre: 'Lunes',
            dia_dia_codigo: '1',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
          {
            dia_nombre: 'Martes',
            dia_dia_codigo: '2',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
          {
            dia_nombre: 'Miercoles',
            dia_dia_codigo: '3',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
          {
            dia_nombre: 'Jueves',
            dia_dia_codigo: '4',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
          {
            dia_nombre: 'Viernes',
            dia_dia_codigo: '5',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
          {
            dia_nombre: 'Sabado',
            dia_dia_codigo: '6',
            dia_usrmod: cremod,
            dia_usrcrea: cremod,
          },
        ],
      });

      var ubicacion1 = await this.prisma.mar_ubi_ubicaciones.create({
        data: {
          ubi_nombre: 'Central',
          ubi_usrcrea: cremod,
          ubi_usrmod: cremod,
        },
      });

      await this.prisma.mar_ubi_ubicaciones.create({
        data: {
          ubi_nombre: 'Bodegas San Ramon',
          ubi_usrcrea: cremod,
          ubi_usrmod: cremod,
        },
      });

      var contrataciones1 = await this.prisma.mar_con_contrataciones.create({
        data: {
          con_nombre: 'Fijo',
          con_usrcrea: cremod,
          con_usrmod: cremod,
        },
      });
      await this.prisma.mar_con_contrataciones.create({
        data: {
          con_nombre: 'Apoyo',
          con_usrcrea: cremod,
          con_usrmod: cremod,
        },
      });
      await this.prisma.mar_con_contrataciones.create({
        data: {
          con_nombre: 'Reemplazo',
          con_usrcrea: cremod,
          con_usrmod: cremod,
        },
      });

      var usuario = await this.prisma.mar_usr_usuario.create({
        data: {
          usr_codigo_emple: '9505002',
          usr_nombres: 'Usuario',
          usr_apellidos: 'Administrador',
          usr_contrasenia: bcrypt.hashSync('9505002', 10),
          usr_usrcrea: cremod,
          usr_usrmod: cremod,
        },
      });

      var empresa = await this.prisma.mar_epr_empresas.create({
        data: {
          epr_nombre: 'Empresa 1',
          epr_direccion: 'San Salvador',
          epr_contacto_nombre: 'Contacto Nombre',
          epr_contacto_correo: 'demo@demo.com',
          epr_contacto_telefono: '+50365326545',
          epr_usrcrea: cremod,
          epr_usrmod: cremod, 
        },
      });

      var empleado = await this.prisma.mar_emp_empleados.create({
        data: {
          emp_codigo_emp: 'T-8502001',
          emp_fecha_nacimiento: new Date(),
          emp_nombres: 'Empleado',
          emp_apellidos: 'Tercerizado',
          emp_usrcrea: cremod,
          emp_usrmod: cremod,
          emp_codemp: empresa.epr_codigo,
          emp_codgen: gender.gen_codigo,
          emp_codubi: ubicacion1.ubi_codigo,
          emp_codcon: contrataciones1.con_codigo,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
