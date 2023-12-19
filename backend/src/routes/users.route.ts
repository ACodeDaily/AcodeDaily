import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { SignupUserDto, LoginUserDto } from '@/dtos/user.dto';
import { Routes } from '@/interfaces/route.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware, RestrictTo } from '@middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, RestrictTo('referrer'), this.user.getUsers);
    this.router.get(`${this.path}/:id`, this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(SignupUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(SignupUserDto, true), this.user.updateUser);
    this.router.delete(`${this.path}/:id`, this.user.deleteUser);
  }
}
