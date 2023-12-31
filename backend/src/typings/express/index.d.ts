declare namespace Express {
  export interface Request {
    user?: {
      _id?: string;
      role?: string[];
      org?: string;
      isVerified?: boolean;
    };
    token?: string;
    secretId?: string;
  }
}
