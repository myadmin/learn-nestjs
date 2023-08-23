import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
    @Inject(EmailService)
    private readonly emailService: EmailService;

    @Inject(RedisService)
    private readonly redisService: RedisService;

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
}
