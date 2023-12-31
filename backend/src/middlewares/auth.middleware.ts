import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY, ACCESS_KEY_ID, SECRET_KEY_ID } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { CreateSecret } from '@/interfaces/secret.interface';
import { UserModel } from '@/models/user.model';
import { SecretModel } from '@/models/secret.model';
import { Constants } from '@utils/constants';
import { Helper } from '@utils/helper';
import { Container } from 'typedi';

const helper = Container.get(Helper);

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = helper.getAuthorization(req);

    if (Authorization) {
      const { _id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = await UserModel.findById(_id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const VerifySecretKey = async (req: Request, res: Response, next: NextFunction) => {
  const { access_key, secret_key } = helper.getAccessAndSecretKey(req);
  if (access_key && secret_key && access_key === ACCESS_KEY_ID && secret_key === SECRET_KEY_ID) {
    next();
  } else {
    next(new HttpException(404, 'Wrong access key or secret key'));
  }
};

export const VerifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, cfUserName }: CreateSecret = req.body;
    const findSecret = await SecretModel.findOne({ token, cfUserName });
    if (!findSecret) throw new HttpException(409, 'Wrong token or cf-username');
    const tokenAge = helper.calculateTimeDifference(findSecret.tokenIssuedAt);

    if (!findSecret || tokenAge > Constants.oneDay) throw new HttpException(409, 'Token is incorrect or expired');
    req.token = token;
    req.secretId = findSecret._id;
    next();
  } catch (error) {
    next(error);
  }
};

export const RestrictTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user.isVerified) throw new HttpException(409, 'Only verified users can access this route');
    if (!roles.some(role => req.user.role.includes(role))) {
      return next(new HttpException(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

export const RestrictedOnlyTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.user.role.includes('admin')) return next();
    if (!helper.areArraysEqual(roles, req.user.role)) throw new HttpException(409, 'You do not have permission to perform this action');
    next();
  };
};
