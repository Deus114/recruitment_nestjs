import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  getUserDashboard = async () => {
    const count = await this.userModel.countDocuments({ isDeleted: false });;
    return count;
  }

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name, email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id
    })
    return newRegister;
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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Không tìm thấy người dùng.';

    return this.userModel.findOne({
      _id: id
    })
      .select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }

  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username
    })
      .populate({
        path: "role",
        select: { name: 1 }
      });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser, _id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Not found user with id = ${_id}`)
    return await this.userModel.updateOne({ _id: _id }, {
      ...updateUserDto,
      updatedBy: {
        _id: _id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Không tìm thấy người dùng.';

    const check = await this.userModel.findById(id);
    if (check && check.email === "admin@gmail.com") {
      throw new BadRequestException("Không thể xóa tài khoản admin@gmail.com");
    }

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
    ).populate({
      path: "role",
      select: { name: 1 }
    });
  }

}
