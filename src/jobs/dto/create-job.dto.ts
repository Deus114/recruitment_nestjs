import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @ApiProperty()
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    logo: string;
}

export class CreateJobDto {
    @ApiProperty()
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    location: string;

    @ApiProperty()
    @IsNotEmpty({ message: "Skills không được để trống" })
    @IsArray({ message: "Skills có dạng array" })
    @IsString({ each: true, message: "Skills có dạng string" })
    skills: string[];

    @ApiProperty()
    @IsNotEmpty({ message: "Số lượng không được để trống" })
    quantity: number;

    @ApiProperty()
    @IsNotEmpty({ message: "Lương không được để trống" })
    salary: number;

    @ApiProperty()
    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: "Level không được để trống" })
    level: string;

    @ApiProperty()
    @IsNotEmpty({ message: "Ngày bắt đầu không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "Ngày bắt đầu có định dạng là Date" })
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: "Ngày kết thúc không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "Ngày kết thúc có định dạng là Date" })
    endDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: "isActive không được để trống" })
    @IsBoolean({ message: "isActive có dạng boolean" })
    isActive: boolean;

    @ApiProperty()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}
