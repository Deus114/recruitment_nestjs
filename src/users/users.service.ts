import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>
  ) { }

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.userModel.findOne({ email: registerUserDto.email });
    if (isExist) {
      throw new BadRequestException(`Email: $${registerUserDto.email} đã tồn tại`);
    }
    let hashPassword = this.getHashPassword(registerUserDto.password);
    let user = await this.userModel.create({
      email: registerUserDto.email,
      password: hashPassword,
      name: registerUserDto.name,
      age: registerUserDto.age,
      address: registerUserDto.address,
      gender: registerUserDto.gender,
      role: registerUserDto.role,
    })
    return {
      _id: user._id,
      createdAt: user.createdAt
    };
  }

  async create(createUserDto: CreateUserDto, i_user: IUser) {
    const isExist = await this.userModel.findOne({ email: createUserDto.email });
    if (isExist) {
      throw new BadRequestException(`Email: $${createUserDto.email} đã tồn tại`);
    }
    let hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      age: createUserDto.age,
      address: createUserDto.address,
      gender: createUserDto.gender,
      role: createUserDto.role,
      company: createUserDto.company,
      createdBy: {
        _id: i_user._id,
        email: i_user.email
      }

    })
    return {
      _id: user._id,
      createdAt: user.createdAt
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Không tìm thấy người dùng.';

    return this.userModel.findOne({
      _id: id
    });
  }

  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Không tìm thấy người dùng.';

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return this.userModel.softDelete({
      _id: id
    });
  }

  updateRefreshToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id },
      { refreshToken }
    )
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne(
      { refreshToken }
    )
  }

}
