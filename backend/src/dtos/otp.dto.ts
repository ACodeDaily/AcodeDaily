import { IsEmail, IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class GenerateOTPDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['signup', 'reset-password'])
  public reason: string;
}

export class VerifyOTPDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNumber()
  @IsNotEmpty()
  public otp: number;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNumber()
  @IsNotEmpty()
  public otp: number;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class ResetPassword {
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;

  @IsString()
  @IsNotEmpty()
  public newPassword: string;
}
