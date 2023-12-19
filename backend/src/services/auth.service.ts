import { hash, compare } from 'bcrypt';
import { Container } from 'typedi';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@/interfaces/user.interface';
import { UserModel } from '@/models/user.model';
import { OtpModel } from '@/models/otp.model';
import { EmailSender } from '@utils/mail';
import { Mail } from '@utils/constants';
import { GenerateOtpRequestBody, Otp, VerifyOtpRequestBody, ForgotPasswordRequestBody, ResetPasswordRequestBody } from '@/interfaces/otp.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60 * 24;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  private emailSender = Container.get(EmailSender);

  public async signup(userData: User): Promise<{ createUserData: User; cookie: string }> {
    const findUser: User = await UserModel.findOne({ email: userData.email });

    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    await this.verifyOTP({ email: userData.email, otp: userData.otp });

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    createUserData.password = undefined;

    const tokenData = createToken(createUserData);
    const cookie = createCookie(tokenData);

    await this.emailSender.sendMailWrapper({
      to: createUserData.email,
      template: 'welcome',
      username: createUserData.username,
      subject: Mail.WelcomeSubject,
    });

    return { createUserData, cookie };
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserModel.findOne({ email: userData.email }).select('+password');

    if (!findUser || !findUser.password) throw new HttpException(409, `Incorrect email or password`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Incorrect email or password');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    findUser.password = undefined;

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public async googleLogin(userData: any): Promise<{ token: string; findUser: User }> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This googleId ${userData.googleId} was not found`);

    const tokenData = createToken(findUser);

    return { token: tokenData.token, findUser };
  }

  public async generateOTP(otpData: GenerateOtpRequestBody): Promise<void> {
    await OtpModel.deleteMany({ email: otpData.email });
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = Date.now();
    await OtpModel.create({ ...otpData, otp, expiresIn });
    await this.emailSender.sendMailWrapper({
      to: otpData.email,
      otp,
      template: 'otp',
      subject: Mail.OTPSubject,
      reason: otpData.reason,
      expiresIn: Mail.OtpExpiresIn,
    });
  }

  public async verifyOTP(otpData: VerifyOtpRequestBody): Promise<void> {
    const findOtp: Otp = await OtpModel.findOne({ email: otpData.email });

    if (findOtp) await OtpModel.updateOne({ email: otpData.email }, { $inc: { attempts: 1 } });
    if (!findOtp) throw new HttpException(409, `OTP not found`);
    if (findOtp.attempts >= 3) throw new HttpException(409, `Attempts exceeded, please generate new OTP`);
    if (findOtp.otp !== otpData.otp) throw new HttpException(409, `Wrong OTP, ${2 - findOtp.attempts} attempts left`);

    const now = Date.now();
    const diff = now - findOtp.expiresIn;
    if (diff > 60000 * 5) throw new HttpException(409, `OTP expired`);

    await OtpModel.deleteMany({ email: otpData.email });
  }

  public async forgotPassword(forgotPasswordData: ForgotPasswordRequestBody): Promise<void> {
    const findUser: User = await UserModel.findOne({ email: forgotPasswordData.email });
    if (!findUser) throw new HttpException(409, `This email ${forgotPasswordData.email} was not found`);
    await this.verifyOTP({ email: forgotPasswordData.email, otp: forgotPasswordData.otp });
    const hashedPassword = await hash(forgotPasswordData.password, 10);
    await UserModel.updateOne({ email: forgotPasswordData.email }, { password: hashedPassword });
    // can send a mail to user that password has been changed
  }

  public async resetPassword(resetPasswordData: ResetPasswordRequestBody, id: string): Promise<void> {
    const findUser: User = await UserModel.findById(id).select('+password');
    if (!findUser) throw new HttpException(409, `This id ${id} was not found`);
    const isPasswordMatching: boolean = await compare(resetPasswordData.oldPassword, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Incorrect password');
    const hashedPassword = await hash(resetPasswordData.newPassword, 10);
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
  }
}
