import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Permission, PermissionSchema } from 'src/permissions/schemas/permission.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { UsersService } from 'src/users/users.service';
import { JobsService } from 'src/jobs/jobs.service';
import { CompaniesService } from 'src/companies/companies.service';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { Company, CompanySchema } from 'src/companies/schema/company.schema';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService, JobsService, CompaniesService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Job.name, schema: JobSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Role.name, schema: RoleSchema }
    ])
  ]
})
export class DatabasesModule { }
