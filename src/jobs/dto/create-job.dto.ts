import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    location: string;

    @IsNotEmpty({ message: "Skills không được để trống" })
    @IsArray({ message: "Skills có dạng array" })
    @IsString({ each: true, message: "Skills có dạng string" })
    skills: string[];

    @IsNotEmpty({ message: "Số lượng không được để trống" })
    quantity: number;

    @IsNotEmpty({ message: "Lương không được để trống" })
    salary: number;

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Level không được để trống" })
    level: string;

    @IsNotEmpty({ message: "Ngày bắt đầu không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "Ngày bắt đầu có định dạng là Date" })
    startDate: Date;

    @IsNotEmpty({ message: "Ngày kết thúc không được để trống" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "Ngày kết thúc có định dạng là Date" })
    endDate: Date;

    @IsNotEmpty({ message: "isActive không được để trống" })
    @IsBoolean({ message: "isActive có dạng boolean" })
    isActive: boolean;

    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}
