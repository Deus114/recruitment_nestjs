import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không đúng định dạng', })
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'skills không được để trống', })
    @IsArray({ message: 'skills có định dạng là array', })
    // "each" tells class-validator to run the validation on each item of the array
    @IsString({ each: true, message: "skill định dạng là string" })
    skills: string[];
}