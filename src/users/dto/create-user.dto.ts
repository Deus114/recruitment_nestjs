import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @ApiProperty()
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    name: string;
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Role không được để trống' })
    @IsMongoId({ message: 'Role có định dạng là MongoId' })
    role: string;

    @ApiProperty()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender: string;

    @ApiProperty()
    role: string;
}

export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'user@gmail.com | admin@gmail.com' })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
    })
    password: string;

}
