import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenVo {
    @ApiProperty({ description: 'accessToken' })
    access_token: string;

    @ApiProperty({ description: 'refreshToken' })
    refresh_token: string;
}
