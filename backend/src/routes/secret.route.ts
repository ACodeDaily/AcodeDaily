import { Router } from 'express';
import { SecretController } from '@controllers/secret.controller';
import { CreateSecretDto } from '@dtos/secret.dto';
import { Routes } from '@interfaces/route.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { VerifySecretKey } from '@middlewares/auth.middleware';

export class SecretRoute implements Routes {
  public path = '/secret';
  public router = Router();
  public secret = new SecretController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(CreateSecretDto), VerifySecretKey, this.secret.createSecret);
    this.router.post(`${this.path}/verify`, ValidationMiddleware(CreateSecretDto), this.secret.verifySecret);
  }
}
