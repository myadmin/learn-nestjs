import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Inject,
    UnauthorizedException,
    DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';

@Controller('user')
export class UserController {
    @Inject(EmailService)
    private readonly emailService: EmailService;

    @Inject(RedisService)
    private readonly redisService: RedisService;

    @Inject(JwtService)
    private readonly jwtService: JwtService;

    @Inject(ConfigService)
    private readonly configService: ConfigService;

    constructor(private readonly userService: UserService) {}

    @Post('registry')
    async registry(@Body() registryUser: RegisterUserDto) {
        return await this.userService.registry(registryUser);
    }

    @Get('register-captcha')
    async captcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);
        console.log(code);
        await this.redisService.set(`captcha_${address}`, code, 60 * 5);
        console.log('redis set success');
        await this.emailService.sendEmail({
            to: address,
            subject: '会议室预定系统注册验证码',
            html: `<h1>您的验证码是：${code}</h1>`,
        });
        return '验证码已发送，请注意查收！';
    }

    @Get('init-data')
    async initData() {
        await this.userService.initData();
        return 'done';
    }

    @Post('login')
    async userLogin(@Body() loginUser: LoginUserDto) {
        const userInfo = await this.userService.findUser(loginUser);

        const vo = await this.userService.login2(loginUser, userInfo);

        vo.accessToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
                username: vo.userInfo.username,
                roles: vo.userInfo.roles,
                permissions: vo.userInfo.permissions,
            },
            {
                expiresIn:
                    this.configService.get('jwt_access_token_expires_time') ||
                    '30m',
            },
        );

        vo.refreshToken = this.jwtService.sign(
            {
                userId: vo.userInfo.id,
            },
            {
                expiresIn:
                    this.configService.get('jwt_refresh_token_expires_time') ||
                    '7d',
            },
        );

        return vo;
    }

    // @Post('admin/login')
    // async adminLogin(@Body() loginUser: LoginUserDto) {
    //     const vo = await this.userService.login(loginUser, true);
    //     return vo;
    // }

    @Get('refresh')
    async refresh(@Query('refreshToken') refreshToken: string) {
        try {
            const data = this.jwtService.verify(refreshToken);

            const user = await this.userService.findUserById(data.userId);

            const access_token = this.jwtService.sign(
                {
                    userId: user.id,
                    username: user.username,
                    roles: user.roles,
                    permissions: user.permissions,
                },
                {
                    expiresIn:
                        this.configService.get(
                            'jwt_access_token_expires_time',
                        ) || '30m',
                },
            );

            const refresh_token = this.jwtService.sign(
                {
                    userId: user.id,
                },
                {
                    expiresIn:
                        this.configService.get(
                            'jwt_refresh_token_expires_time',
                        ) || '7d',
                },
            );

            return {
                access_token,
                refresh_token,
            };
        } catch (e) {
            throw new UnauthorizedException('token 已失效，请重新登录');
        }
    }

    // @Get('admin/refresh')
    // async adminRefresh(@Query('refreshToken') refreshToken: string) {
    //     try {
    //         const data = this.jwtService.verify(refreshToken);

    //         const user = await this.userService.findUserById(data.userId);

    //         const access_token = this.jwtService.sign(
    //             {
    //                 userId: user.id,
    //                 username: user.username,
    //                 roles: user.roles,
    //                 permissions: user.permissions,
    //             },
    //             {
    //                 expiresIn:
    //                     this.configService.get(
    //                         'jwt_access_token_expires_time',
    //                     ) || '30m',
    //             },
    //         );

    //         const refresh_token = this.jwtService.sign(
    //             {
    //                 userId: user.id,
    //             },
    //             {
    //                 expiresIn:
    //                     this.configService.get(
    //                         'jwt_refresh_token_expires_time',
    //                     ) || '7d',
    //             },
    //         );

    //         return {
    //             access_token,
    //             refresh_token,
    //         };
    //     } catch (e) {
    //         throw new UnauthorizedException('token 已失效，请重新登录');
    //     }
    // }

    @Get('info')
    @RequireLogin()
    async info(@UserInfo('userId') userId: number) {
        const user = await this.userService.findUserDetailById(userId);
        const vo = new UserDetailVo();
        vo.id = user.id;
        vo.username = user.username;
        vo.nickName = user.nickName;
        vo.email = user.email;
        vo.headPic = user.headPic;
        vo.phoneNumber = user.phoneNumber;
        vo.isFrozen = user.isFrozen;
        vo.createTime = user.createTime;
        return vo;
    }

    @Post('update_password')
    @RequireLogin()
    async updatePassword(
        @UserInfo('userId') userId: number,
        @Body() passwordDto: UpdateUserPasswordDto,
    ) {
        console.log(passwordDto);
        return await this.userService.updatePassword(userId, passwordDto);
    }

    @Get('update_password/captcha')
    async updatePasswordCaptcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(
            `update_password_captcha_${address}`,
            code,
            60 * 10,
        );

        await this.emailService.sendEmail({
            to: address,
            subject: '会议室预定系统更改密码验证码',
            html: `<h1>您更改密码的验证码是：${code}</h1>`,
        });
        return '验证码已发送，请注意查收！';
    }

    @Post('update')
    @RequireLogin()
    async update(
        @UserInfo('userId') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.userService.update(userId, updateUserDto);
    }

    @Get('update/captcha')
    async updateCaptcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(
            `update_user_captcha_${address}`,
            code,
            60 * 10,
        );

        await this.emailService.sendEmail({
            to: address,
            subject: '会议室预定系统更改信息验证码',
            html: `<h1>您更改信息的验证码是：${code}</h1>`,
        });
        return '验证码已发送，请注意查收！';
    }

    @Get('freeze')
    async freeze(@Query('id') userId: number) {
        await this.userService.freezeUserById(userId);
        return 'success';
    }

    @Get('list')
    async list(
        @Query(
            'pageNo',
            new DefaultValuePipe(1),
            generateParseIntPipe('pageNo'),
        )
        pageNo: number,
        @Query(
            'pageSize',
            new DefaultValuePipe(2),
            generateParseIntPipe('pageSize'),
        )
        pageSize: number,
        @Query('username') username: string,
        @Query('nickName') nickName: string,
        @Query('email') email: string,
    ) {
        const users = await this.userService.findUsersByPage(
            username,
            nickName,
            email,
            pageNo,
            pageSize,
        );
        return users;
    }
}
