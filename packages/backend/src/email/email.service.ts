import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);

	constructor() {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
	}

	async sendVerificationCode(email: string, code: string): Promise<void> {
		const msg = {
			to: email,
			from: process.env.EMAIL_FROM!,
			subject: 'Verification Code',
			text: `Your verification code is: ${code}`,
			html: `<p>Your verification code is: <strong>${code}</strong></p>`,
		};

		try {
			await sgMail.send(msg);
			this.logger.log(`Sent verification code to ${email}`);
		} catch (err: unknown) {
			this.logger.error(`Failed to send email to ${email}`, err as Error);
			throw err;
		}
	}
}
