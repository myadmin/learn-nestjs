import { ApiProperty } from '@nestjs/swagger';
export class UserDetailVo {
    @ApiProperty({ description: '用户id', example: 1 })
    id: number;

    @ApiProperty({ description: '用户名', example: 'zhangsan' })
    username: string;

    @ApiProperty({ description: '昵称', example: '张三' })
    nickName: string;

    @ApiProperty({ description: '邮箱', example: 'xxx@xx.com' })
    email: string;

    @ApiProperty({ description: '头像', example: 'http://xxx.com/xxx.png' })
    headPic: string;

    @ApiProperty({ description: '手机号', example: '13888888888' })
    phoneNumber: string;

    @ApiProperty({ description: '是否冻结', example: false })
    isFrozen: boolean;

    @ApiProperty({
        description: '创建时间',
        example: '2023-08-28T08:43:44.100Z',
    })
    createTime: Date;
}
