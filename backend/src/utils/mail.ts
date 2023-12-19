import { logger } from '@utils/logger';
import { Service, Container } from 'typedi';
import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_PASSWORD, SMTP_USERNAME } from '@config';
import { Helper } from '@/utils/helper';
import { Mail } from '@utils/constants';
import { renderTemplateData } from '@/interfaces/template.interface';

@Service()
export class EmailSender {
  private transporter: Transporter;
  private helper = Container.get(Helper);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
      logger: false,
    } as any); // Explicitly cast as any to resolve TypeScript error

    this.transporter
      .verify()
      .then(() => logger.info('Connected to EMAIL SERVER'))
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
        logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env');
      });
  }

  async sendEmail(mailOptions: SendMailOptions): Promise<void> {
    this.transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
      if (error) {
        logger.error('Error:', error.message);
      } else {
        logger.notice('Email sent:', info.response);
      }

      // Close the transporter after sending the email
      this.transporter.close();
    });
  }

  async sendMailWrapper(data: renderTemplateData): Promise<void> {
    const text = this.helper.renderTemplate(data);

    const mailOptions: SendMailOptions = {
      from: Mail.EmailFrom,
      to: data.to,
      subject: data.subject,
      text,
    };

    await this.sendEmail(mailOptions);
  }
}
