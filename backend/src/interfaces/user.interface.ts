export interface User {
  _id?: string;
  email: string;
  password?: string;
  role: string;
  googleId?: string;
  otp?: number;
  username: string;
}

export interface GoogleUser {
  _id?: string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}
