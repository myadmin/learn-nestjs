import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: 'smtp.qq.com',
            port: 587,
            secure: false,
            auth: {
                user: '332671383@qq.com',
                pass: 'avnadexbscitbgii',
            },
        });
    }

    async sendEmail({
        to,
        subject,
        html,
    }: {
        to: string;
        subject: string;
        html: string;
    }) {
        console.log('send email');
        await this.transporter.sendMail({
            from: {
                name: '会议室预定系统',
                address: '332671383@qq.com',
            },
            to,
            subject,
            html,
        });
    }
}
