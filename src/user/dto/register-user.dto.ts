import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @ApiProperty({ description: '用户名', example: 'admin' })
    username: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @MinLength(6, { message: '密码长度不能小于6位' })
    @ApiProperty({ minLength: 6, description: '密码', example: '123456' })
    password: string;

    @IsNotEmpty({ message: '昵称不能为空' })
    @ApiProperty({ description: '昵称', example: 'admin' })
    nickName: string;

    @IsNotEmpty({ message: '邮箱不能为空' })
    @IsEmail({}, { message: '不是合法的邮箱格式' })
    @ApiProperty({ description: '邮箱', example: 'xxx@xx.com' })
    email: string;

    @IsNotEmpty({ message: '验证码不能为空' })
    @ApiProperty({ description: '验证码', example: '123456' })
    captcha: string;
}
