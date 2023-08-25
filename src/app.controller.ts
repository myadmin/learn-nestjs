import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission, UserInfo } from './custom.decorator';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('aaa')
    // @SetMetadata('require-login', true)
    // @SetMetadata('require-permission', ['ddd'])
    @RequireLogin()
    @RequirePermission('ddd')
    aaa(@UserInfo('username') username: string, @UserInfo() userInfo): string {
        console.log(username);
        console.log(userInfo);
        return 'aaa';
    }

    @Get('bbb')
    bbb(): string {
        return 'bbb';
    }
}
