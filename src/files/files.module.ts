import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
})
export class FilesModule { }
