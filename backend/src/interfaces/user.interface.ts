export interface User {
  _id?: string;
  email: string;
  password?: string;
  role: [string];
  googleId?: string;
  otp?: number;
  username: string;
  isVerified: boolean;
  verifiedBy?: string;
  totalReferred?: number;
  activities?: [string];
  org?: string;
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

export interface UserFilter {
  isVerified?: boolean;
  totalReferred?: -1 | 1;
  org?: string;
  sort?: -1 | 1;
}

export interface UpdateUserRoles {
  role: 'referrer' | 'moderator';
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  org: string;
}
