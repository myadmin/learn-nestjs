import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
    @IsNotEmpty({ message: '密码不能为空' })
    @MinLength(6, { message: '密码长度不能小于6位' })
    @ApiProperty({ description: '密码' })
    password: string;

    @IsNotEmpty({ message: '邮箱不能为空' })
    @IsEmail({}, { message: '邮箱格式不正确' })
    @ApiProperty({ description: '邮箱' })
    email: string;

    @IsNotEmpty({ message: '验证码不能为空' })
    @ApiProperty({ description: '验证码' })
    captcha: string;
}
