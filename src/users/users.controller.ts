import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Auth, GetUser } from 'src/users/decorators';
import { CreateAuthDto, CreateUserDto, UpdateUserDto } from './dto';
import { mar_usr_usuario } from '@prisma/client'; 
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { PasswordUserDto } from './dto/password-user.dto';


@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post('login')
  loginUser(@Body() loginUserDto: CreateAuthDto) {
    return this.usersService.login(loginUserDto);
  }


  @Get('check-status')
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  checkStatus(@GetUser() user: mar_usr_usuario) {
    return this.usersService.checkStatus(user);
  }


  @Post()
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: mar_usr_usuario
  ) {
    return this.usersService.create(createUserDto, user);
  }



  @Post("update/password")
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  updatePassword(
    @Body() passwordUserDto: PasswordUserDto,
    @GetUser() user: mar_usr_usuario
  ) {
    return this.usersService.updatePassword(passwordUserDto, user);
  }

  @Get()
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(`${id}`);
  }

  @Put(':id')
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto,
  @GetUser() user: mar_usr_usuario) {
    return this.usersService.update(`${id}`, updateUserDto,user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(`${id}`);
  }
}
