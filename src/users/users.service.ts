import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto, CreateUserDto, UpdateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { mar_usr_usuario } from '@prisma/client';
import { PrismaService } from 'src/common/services';
import { PasswordUserDto } from './dto/password-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto, user: mar_usr_usuario) {
    try {
      const { usr_contrasenia, ...resto } = createUserDto;
      var data: any = {
        usr_contrasenia: bcrypt.hashSync(usr_contrasenia, 10),
        usr_usrcrea: user.usr_nombres + ' ' + user.usr_apellidos,
        usr_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
        usr_codigo_emple: resto.usr_codigo,
        usr_nombres: resto.usr_nombres,
        usr_apellidos: resto.usr_apellidos,
      };
      const register = await this.prisma.mar_usr_usuario.create({
        data,
      });
      delete register.usr_contrasenia;
      return register;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updatePassword(
    passwordUserDto: PasswordUserDto,
    user: mar_usr_usuario,
  ) {
    try {
      const respDb = await this.prisma.mar_usr_usuario.findFirst({
        where: { usr_codigo: user.usr_codigo },
      });

      if (!respDb) throw new NotFoundException('Usuario no encontrado');
      const password = passwordUserDto.curren_password;
      if (!bcrypt.compareSync(password, respDb.usr_contrasenia))
        throw new UnauthorizedException('Credenciales incorrectas');

      if (
        bcrypt.compareSync(passwordUserDto.new_password, user.usr_contrasenia)
      )
        throw new UnauthorizedException(
          'La nueva contraseña no debe ser la misma que la actual',
        );

      await this.prisma.mar_usr_usuario.update({
        where: { usr_codigo: respDb.usr_codigo },
        data: {
          usr_contrasenia: bcrypt.hashSync(passwordUserDto.new_password, 10),
        },
      });
      return;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(createUserDto: CreateAuthDto): Promise<any> {
    const { password, user_code } = createUserDto;

    const user = await this.prisma.mar_usr_usuario.findFirst({
      where: { usr_codigo_emple: user_code },
      select: {
        usr_codigo_emple: true,
        usr_codigo: true,
        usr_nombres: true,
        usr_apellidos: true,
        usr_contrasenia: true,
        usr_estado: true,
        usr_inten_inicio: true,
      }, //! OJO!
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (user.usr_estado == 'INACTIVE' || user.usr_inten_inicio == 3)
      throw new UnauthorizedException('Usuario bloqueado, favor comunicarse con soporte técnico');

    if (!bcrypt.compareSync(password, user.usr_contrasenia)) {
      await this.prisma.mar_usr_usuario.update({
        where: { usr_codigo: user.usr_codigo },
        data: { usr_inten_inicio: user.usr_inten_inicio + 1 },
      });
      throw new UnauthorizedException('Credenciales incorrectas');
    }else{
      await this.prisma.mar_usr_usuario.update({
        where: { usr_codigo: user.usr_codigo },
        data: { usr_inten_inicio: 0 },
      });
    }
    delete user.usr_contrasenia;
    var data: any = {
      ...user,
      token: this.getJwtToken({ marca_usr_uuid: user.usr_codigo }),
    };

    return data;
  }

  async checkStatus(user: mar_usr_usuario) {
    try {
      const userN = await this.prisma.mar_usr_usuario.findFirst({
        where: { usr_codigo: user.usr_codigo },
        select: {
          usr_codigo_emple: true,
          usr_codigo: true,
          usr_nombres: true,
          usr_apellidos: true,
          usr_contrasenia: true,
          usr_estado: true,
        }, //! OJO!
      });
      delete userN.usr_contrasenia;
      return {
        ...userN,
        token: this.getJwtToken({ marca_usr_uuid: userN.usr_codigo }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error favor intentarlo mas tarde',
      );
    }
  }

  findAll() {
    return this.prisma.mar_usr_usuario.findMany({
      where: { usr_estado: 'ACTIVE' },
    });
  }

  async findOne(term: string) {
    let resp = await this.prisma.mar_usr_usuario.findFirst({
      where: { usr_codigo: term },
    });
    if (!resp)
      throw new NotFoundException(`Usuario con el id ${term} no encontrada`);

    return resp;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user: mar_usr_usuario,
  ) {
    await this.findOne(id);
    try {
      const { usr_contrasenia, ...resto } = updateUserDto;
      var data: any = {
        usr_contrasenia: bcrypt.hashSync(usr_contrasenia, 10),
        usr_usrmod: user.usr_nombres + ' ' + user.usr_apellidos,
        usr_codigo_emple: resto.usr_codigo,
        usr_nombres: resto.usr_nombres,
        usr_apellidos: resto.usr_apellidos,
      };
      const product = await this.prisma.mar_usr_usuario.update({
        where: { usr_codigo: id },
        data,
      });
      if (!product)
        throw new NotFoundException(`Product with id: ${id} not found`);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const resp = await this.findOne(id);
    await this.prisma.mar_usr_usuario.update({
      where: { usr_codigo: resp.usr_codigo },
      data: { usr_estado: 'INACTIVE' },
    });
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
