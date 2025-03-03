import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, module, method } = createPermissionDto;
    const { email, _id } = user;
    let check = await this.permissionModel.findOne({
      apiPath: apiPath,
      method: method
    })

    if (check) {
      throw new BadRequestException(`Permission với apiPath: ${apiPath} và method ${method} đã tồn tại`);
    }

    let res = await this.permissionModel.create({
      name, apiPath, module, method,
      createdBy: { _id, email },
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

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel.find(filter)
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
    try {
      let res = await this.permissionModel.findOne({ _id: id });
      return res;
    } catch (error) {
      throw new BadRequestException('Không tìm thấy permission.');
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Không tìm thấy Permission.');

    let { name, apiPath, module, method } = updatePermissionDto;

    let res = await this.permissionModel.updateOne({ _id: id }, {
      name, apiPath, module, method
    });

    return res;
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.permissionModel.softDelete({
      _id: id
    });
  }
}
