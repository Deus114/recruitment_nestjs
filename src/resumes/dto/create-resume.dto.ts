import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';


export class CreateResumeDto {
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

export class CreateUserCvDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'url không được để trống', })
    url: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'companyId không được để trống', })
    @IsMongoId({ message: 'companyId is a mongo id' })
    companyId: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @IsNotEmpty({ message: 'jobId không được để trống', })
    @IsMongoId({ message: 'jobId is a mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;
}
