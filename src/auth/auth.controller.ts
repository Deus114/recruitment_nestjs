import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request as RequestExpress, Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private rolesService: RolesService
    ) { }

    @Public()
    @ResponseMessage('Đăng nhập thành công')
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    handleLogin(
        @Request() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage('Đăng kí thành công')
    @Post('/register')
    handleRegister(
        @Body() registerUserDto: RegisterUserDto
    ) {
        registerUserDto.role = 'USER';
        return this.authService.register(registerUserDto);
    }

    @ResponseMessage('Lấy thông tin người dùng thành công')
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions;
        return { user };
    }

    @Public()
    @ResponseMessage('Lấy thông tin người dùng từ refresh token')
    @Get('/refresh')
    handleRefreshToken(@Req() request: RequestExpress,
        @Res({ passthrough: true }) response: Response
    ) {
        let refreshToken = request.cookies["refreshToken"];
        return this.authService.processRefreshToken(refreshToken, response);
    }

    @ResponseMessage('Đăng xuất thành công')
    @Post('/logout')
    handleLogout(@User() user: IUser,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.logout(user, response);
    }

}
