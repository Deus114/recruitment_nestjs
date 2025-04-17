import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class UpdateResumeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email không được để trống', })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'userId không được để trống', })
    userId: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @IsNotEmpty({ message: 'url không được để trống', })
    url: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'status không được để trống', })
    status: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'companyId không được để trống', })
    companyId: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @IsNotEmpty({ message: 'jobId không được để trống', })
    jobId: mongoose.Schema.Types.ObjectId;
}
