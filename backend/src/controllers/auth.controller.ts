import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@/interfaces/user.interface';
import { GenerateOtpRequestBody, VerifyOtpRequestBody, ForgotPasswordRequestBody, ResetPasswordRequestBody } from '@/interfaces/otp.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { createUserData: signUpUserData, cookie } = await this.auth.signup(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(201).json({ status: 'success', data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { cookie, findUser } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ status: 'success', message: 'login', data: findUser });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ status: 'success', data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.user;
      const { token, findUser } = await this.auth.googleLogin(userData);

      res.status(200).send({ status: 'success', data: findUser, message: 'googleCallback', token });
    } catch (error) {
      next(error);
    }
  };

  public generateOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const OTPData: GenerateOtpRequestBody = req.body;
      await this.auth.generateOTP(OTPData);

      res.status(200).json({ status: 'success', message: 'OTP generated' });
    } catch (error) {
      next(error);
    }
  };

  public verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const OTPData: VerifyOtpRequestBody = req.body;
      await this.auth.verifyOTP(OTPData);

      res.status(200).json({ status: 'success', message: 'OTP verified' });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ForgotPasswordRequestBody = req.body;
      await this.auth.forgotPassword(userData);

      res.status(200).json({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ResetPasswordRequestBody = req.body;
      const { _id } = req.user;
      await this.auth.resetPassword(userData, _id);

      res.status(200).json({ status: 'success', message: 'Password changed' });
    } catch (error) {
      next(error);
    }
  };
}
