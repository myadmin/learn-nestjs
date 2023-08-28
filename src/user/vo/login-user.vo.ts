import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
    @ApiProperty({ description: '用户id', example: 1 })
    id: number;

    @ApiProperty({ description: '用户名', example: 'zhangsan' })
    username: string;

    @ApiProperty({ description: '昵称', example: '张三' })
    nickName: string;

    @ApiProperty({ description: '邮箱', example: 'xxx@xxx.com' })
    email: string;

    @ApiProperty({ description: '头像', example: 'http://xxx.com/xxx.png' })
    headPic: string;

    @ApiProperty({ description: '手机号', example: '13888888888' })
    phoneNumber: string;

    @ApiProperty({ description: '是否冻结', example: false })
    isFrozen: boolean;

    @ApiProperty({ description: '是否是管理员', example: false })
    isAdmin: boolean;

    @ApiProperty({ description: '创建时间', example: 1618222222222 })
    createTime: number;

    @ApiProperty({ description: '角色列表', example: ['admin'] })
    roles: string[];

    @ApiProperty({ description: '权限列表', example: ['admin'] })
    permissions: string[];
}

export class LoginUserVo {
    @ApiProperty({ description: '用户信息' })
    userInfo: UserInfo;

    @ApiProperty({ description: 'accessToken' })
    accessToken: string;

    @ApiProperty({ description: 'refreshToken' })
    refreshToken: string;
}
