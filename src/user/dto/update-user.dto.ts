import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ description: '头像' })
    headPic: string;

    @ApiProperty({ description: '昵称' })
    nickName: string;

    @IsNotEmpty({ message: '邮箱不能为空' })
    @IsEmail({}, { message: '邮箱格式不正确' })
    @ApiProperty({ description: '邮箱' })
    email: string;

    @IsNotEmpty({ message: '验证码不能为空' })
    @ApiProperty({ description: '验证码' })
    captcha: string;
}
