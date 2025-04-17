import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, UseFilters } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { HttpExceptionFilter } from 'src/core/http-exception.filter';
import { ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Public()
  @Post('upload')
  @ResponseMessage("Upload Single File")
  @UseInterceptors(FileInterceptor('fileUpload'))
  @UseFilters(new HttpExceptionFilter())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileUpload: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'folder_type',
    required: true,
    description: 'Custom header',
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }
  }
}
