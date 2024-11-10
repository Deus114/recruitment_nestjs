import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            let isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true)
                return user;
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        let refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(refresh_token, _id);

        response.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        })

        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role
        };

    }

    async register(registerUserDto: RegisterUserDto) {
        let res = await this.usersService.register(registerUserDto)
        return res;
    }

    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        });
        return refreshToken
    }

    processRefreshToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken,
                { secret: this.configService.get<string>("JWT_REFRESH_TOKEN"), }
            )
            let user = await this.usersService.findUserByRefreshToken(refreshToken);
            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token login",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                }
                let refresh_token = this.createRefreshToken(payload);
                await this.usersService.updateRefreshToken(refresh_token, _id.toString());

                response.clearCookie('refreshToken');
                response.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    _id,
                    name,
                    email,
                    role
                };
            } else {
                throw new BadRequestException(`Refresh token không hợp lệ, vui lòng đăng nhập`);
            }
        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ, vui lòng đăng nhập`);
        }
    }

    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateRefreshToken("", user._id);
        response.clearCookie("refreshToken");
        return "ok";
    }
}
