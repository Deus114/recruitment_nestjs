import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    let { name, description, isActive, permission } = createRoleDto;
    let check = await this.roleModel.findOne({ name: name });

    if (check) {
      throw new BadRequestException(`Role: ${name} đã tồn tại`);
    }

    let res = await this.roleModel.create({
      name, description, isActive, permission,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: res?._id,
      createdAt: res?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel.find(filter)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found role")
    }

    return (await this.roleModel.findById(id)).populate({
      path: "permissions",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    });
  }


  async update(id: string, updateRoleDto: UpdateRoleDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Không tìm thấy Role.');

    let { name, description, isActive, permission } = updateRoleDto;

    let res = await this.roleModel.updateOne({ _id: id }, {
      name, description, isActive, permission
    });

    return res;
  }

  async remove(id: string, user: IUser) {
    let check = await this.roleModel.findById(id);
    if (check.name === "ADMIN")
      throw new BadRequestException('Không thể xóa role ADMIN');
    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.roleModel.softDelete({
      _id: id
    });
  }
}
