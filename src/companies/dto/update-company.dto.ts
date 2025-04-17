import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Logo không được để trống' })
    logo: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;
}
