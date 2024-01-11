import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { imageFileFilter } from 'src/common/helpers';
import { UPLOADFILE } from 'src/common/const';



@Controller('files')
@ApiTags('Upload')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post(':code')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADFILE,
        filename: (_, file, cb) => {
          var splitName = file.originalname.split(".");
          cb(null, new Date().getTime() + `.${splitName[1]}`);
        },
      }),
      fileFilter: imageFileFilter
    }),
  )
  uploadFile(
    @UploadedFile() file,
    @Param('code') code: string,
  ) {
    console.log(file)
    return this.filesService.renameFile(file, code);
  }


  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads_temp',
        filename: (_, file, cb) => {
          var splitName = file.originalname.split(".");
          cb(null, new Date().getTime() + `.${splitName[1]}`);
        },
      }),
      fileFilter: imageFileFilter
    }),
  )
  uploadFilee(
    @UploadedFile() file,
  ) { 
    return this.filesService.identify(file);
  }
}

