import passport from 'passport';
import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { LoginUserDto, SignupUserDto } from '@/dtos/user.dto';
import { GenerateOTPDto, VerifyOTPDto, ForgotPasswordDto, ResetPassword } from '@dtos/otp.dto';
import { Routes } from '@/interfaces/route.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/auth/';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, ValidationMiddleware(SignupUserDto), this.auth.signUp);
    this.router.post(`${this.path}login`, ValidationMiddleware(LoginUserDto), this.auth.logIn);
    this.router.post(`${this.path}logout`, AuthMiddleware, this.auth.logOut);
    this.router.post(`${this.path}otp`, ValidationMiddleware(GenerateOTPDto), this.auth.generateOTP);
    this.router.post(`${this.path}otp/verify`, ValidationMiddleware(VerifyOTPDto), this.auth.verifyOTP);
    this.router.post(`${this.path}forgot/password`, ValidationMiddleware(ForgotPasswordDto), this.auth.forgotPassword);
    this.router.post(`${this.path}reset/password`, AuthMiddleware, ValidationMiddleware(ResetPassword), this.auth.resetPassword);
    this.router.get(`${this.path}google`, passport.authenticate('google', { scope: ['profile', 'email'] }));
    this.router.get(
      `${this.path}google/callback`,
      passport.authenticate('google', { failureRedirect: '/login', session: false }),
      this.auth.googleCallback,
    );
  }
}
