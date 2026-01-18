import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  try {
    let transporter = null as any;

    // If SMTP config provided, try to use it and verify connection
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        // verify connection; will throw if connection refused
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        await transporter.verify();
      } catch (err) {
        console.warn('Configured SMTP not reachable, falling back to Ethereal test account', err);
        transporter = null;
      }
    }

    // If transporter not created (or verification failed), create an Ethereal test account
    if (!transporter) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'no-reply@example.com',
      to: email,
      subject: 'Welcome to Admin Dashboard',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>You can now access the admin dashboard.</p>
      `,
    });

    console.log(`Welcome email sent to ${email} messageId=${info.messageId}`);

    // If using Ethereal (or test account), log preview URL to inspect the message
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Preview URL: ${previewUrl}`);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};