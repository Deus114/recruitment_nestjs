import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePassWorDto, UpdateUserDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ResponseMessage('Tạo mới người dùng thành công')
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto, @User() user: IUser
  ) {
    return await this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Lấy dữ liệu thành công')
  findAll(@Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage('Cập nhật người dùng thành công')
  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
    @Param('id') id: string
  ) {
    let updatedUser = await this.usersService.update(updateUserDto, user, id);
    return updatedUser;
  }

  @ResponseMessage('Cập nhật người dùng thành công')
  @Put()
  async updateInfo(
    @Body() updateUserDto: UpdateUserInfoDto,
    @User() user: IUser) {
    let updatedUser = await this.usersService.updateInfo(updateUserDto, user);
    return updatedUser;
  }

  @ResponseMessage('Xóa người dùng thành công')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }

  @ResponseMessage('Cập nhật mật khẩu thành công')
  @Post("/change-password")
  async changePassword(@Body() changePasswordDto: ChangePassWorDto) {
    return await this.usersService.changePassword(changePasswordDto);
  }
}
