import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @ApiProperty({ description: '用户名', example: 'admin' })
    username: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @ApiProperty({ description: '密码', example: '123456' })
    password: string;
}
