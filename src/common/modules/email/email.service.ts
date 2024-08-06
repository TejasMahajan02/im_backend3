import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';
import { EmailSubjects, OneTimePasswordEmailBody, VerificationEmailBody } from 'src/common/constants/messages';

@Injectable()
export class EmailService {
    constructor(private readonly sendGridClient: SendGridClient) { }

    async sendEmail(recipient: string, subject: string, body: string): Promise<void> {
        const mail: MailDataRequired = {
            to: recipient,
            from: process.env.SENDGRID_SENDER_ID, //Approved sender ID in Sendgrid
            subject,
            content: [{ type: 'text/plain', value: body }],
        };
        await this.sendGridClient.send(mail);
    }

    async sendEmailWithTemplate(recipient: string, subject: string): Promise<void> {
        const mail: MailDataRequired = {
            to: recipient,
            // cc: 'example@mail.com', //Assuming you want to send a copy to this email
            from: process.env.SENDGRID_SENDER_ID, //Approved sender ID in Sendgrid
            templateId: process.env.SENDGRID_TEMPLATE_ID, //Retrieve from config service or environment variable
            dynamicTemplateData: { subject }, //The data to be used in the template
        };
        await this.sendGridClient.send(mail);
    }

    async sendOneTimePassword(recipient: string, password: string): Promise<void> {
        await this.sendEmail(recipient, EmailSubjects.oneTimePassword, OneTimePasswordEmailBody(password));
    }

    async sendVerificationKey(recipient: string, key: string): Promise<void> {
        await this.sendEmail(recipient, EmailSubjects.verificationKey, VerificationEmailBody(key));
    }
}