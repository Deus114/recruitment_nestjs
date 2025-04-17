import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePermissionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'name không được để trống', })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'apiPath không được để trống', })
    apiPath: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'method không được để trống', })
    method: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'module không được để trống', })
    module: string;
}
