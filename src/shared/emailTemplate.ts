import { ISupport } from '../app/modules/support/support.interface';
import config from '../config';
import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify Your Account',
    html: `
      <body style="font-family: Verdana, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <img src="http://82.180.137.106:3000/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
            <h2 style="color: #F05223; font-size: 20px; text-align: center; margin-bottom: 20px;">Hey! ${values.name} <br> Your ${config.server_name} Account Credentials</h2>
            <div style="text-align: center;">
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
                <span style="background-color: #F05223; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</span>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
            </div>
        </div>
      </body>
    `,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset Your Password',
    html: `
      <body style="font-family: Verdana, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <img src="http://82.180.137.106:3000/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
            <div style="text-align: center;">
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
                <span style="background-color: #F05223; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</span>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align: center">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
            </div>
        </div>
      </body>
    `,
  };
  return data;
};

const supportResponseToAdmin = (values: ISupport) => {
  const data = {
    to: config.email.from!,
    subject: 'New Support Request',
    html: `
      <body style="font-family: Verdana, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
        <div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <img src="http://82.180.137.106:3000/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          
          <h2 style="text-align: center; color: #333; margin-bottom: 20px;">New Support Request</h2>

          <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color:#333;">First Name:</td>
              <td style="padding: 8px;">${values.firstName}</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 8px; font-weight: bold; color:#333;">Last Name:</td>
              <td style="padding: 8px;">${values.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color:#333;">Email:</td>
              <td style="padding: 8px;">${values.email}</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 8px; font-weight: bold; color:#333;">Phone:</td>
              <td style="padding: 8px;">${values.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color:#333;">Subject:</td>
              <td style="padding: 8px;">${values.subject}</td>
            </tr>
          </table>

          <div style="padding: 15px; background-color: #fdf3f0; border-left: 4px solid #F05223; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6;">
              ${values.message}
            </p>
          </div>

          <p style="color: #b9b4b4; font-size: 14px; line-height: 1.5; text-align: center;">
            This message was sent from the support form. Please respond to the user's email if follow-up is required.
          </p>
        </div>
      </body>
    `,
  };
  return data;
};

// confirmation email to user after submit support request
const supportConfirmationToUser = (values: ISupport) => {
  const data = {
    to: values.email,
    subject: 'We’ve received your support request!',
    html: `
      <body style="font-family: Verdana, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
        <div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <img src="http://82.180.137.106:3000/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          
          <h2 style="text-align: center; color: #333; margin-bottom: 10px;">Hi ${values.firstName},</h2>
          <p style="text-align: center; font-size: 16px; color: #666; margin-bottom: 30px;">
            Thanks for reaching out! We've received your request and our team will get back to you as soon as possible.
          </p>

          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-bottom: 20px;">
            <h3 style="font-size: 14px; color: #F05223; text-transform: uppercase; letter-spacing: 1px;">Request Summary:</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color:#333; width: 30%;">Subject:</td>
                <td style="padding: 8px 0;">${values.subject}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 15px; background-color: #f9f9f9; border-radius: 6px; font-style: italic; border: 1px solid #eee; margin-bottom: 30px;">
            <p style="margin: 0; color: #777; font-size: 14px; line-height: 1.6;">
              "${values.message}"
            </p>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #b9b4b4; font-size: 12px; line-height: 1.5; text-align: center;">
            This is an automated confirmation. Please do not worry, a real human from our team will be in touch shortly.
          </p>
        </div>
      </body>
    `,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  supportResponseToAdmin,
  supportConfirmationToUser,
};
