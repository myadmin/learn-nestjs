import { ApiProperty } from '@nestjs/swagger';

class User {
    @ApiProperty({ description: '用户id' })
    id: number;

    @ApiProperty({ description: '用户名' })
    username: string;

    @ApiProperty({ description: '昵称' })
    nickName: string;

    @ApiProperty({ description: '邮箱' })
    email: string;

    @ApiProperty({ description: '手机号' })
    phoneNumber: string;

    @ApiProperty({ description: '是否冻结' })
    isFrozen: boolean;

    @ApiProperty({ description: '头像' })
    headPic: string;

    @ApiProperty({ description: '创建时间' })
    createTime: Date;
}

export class UserListVo {
    @ApiProperty({ type: [User], description: '用户列表' })
    users: User[];

    @ApiProperty({ description: '总数' })
    totalCount: number;
}
