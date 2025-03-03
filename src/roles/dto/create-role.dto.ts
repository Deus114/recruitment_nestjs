import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'description không được để trống', })
    description: string;

    @IsNotEmpty({ message: 'isActive không được để trống', })
    @IsBoolean({ message: 'isActive có kiểu là boolean' })
    isActive: string;

    @IsNotEmpty({ message: 'permission không được để trống', })
    @IsMongoId({ each: true, message: 'Mỗi permission là mongo object Id' })
    @IsArray({ message: "permission có dạng array" })
    permission: mongoose.Schema.Types.ObjectId[];
}
