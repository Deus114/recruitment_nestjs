import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id')
  id: string
  ) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage('Cập nhật người dùng thành công')
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @ResponseMessage('Xóa người dùng thành công')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
