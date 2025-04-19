import { Controller, Get } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { JobsService } from 'src/jobs/jobs.service';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('databases')
export class DatabasesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly jobsService: JobsService,
  ) { }

  @ResponseMessage('Lấy dữ liệu thành công')
  @Get('/dashboard')
  async getDashboard() {
    const countUser = await this.usersService.getUserDashboard();
    const countCompany = await this.companiesService.getCompanyDashboard();
    const countJob = await this.jobsService.getJobDashboard();
    return {
      countUser,
      countCompany,
      countJob
    }
  }
}
