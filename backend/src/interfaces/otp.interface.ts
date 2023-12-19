export interface Otp {
  _id?: string;
  email: string;
  otp: number;
  reason: string;
  expiresIn: number;
  attempts: number;
}

export interface GenerateOtpRequestBody {
  email: string;
  reason: string;
}

export interface VerifyOtpRequestBody {
  email: string;
  otp: number;
}

export interface ForgotPasswordRequestBody {
  email: string;
  otp: number;
  password: string;
}

export interface ResetPasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}
