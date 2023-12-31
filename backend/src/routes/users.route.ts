import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { UpdateUserDto, UpdateUserRolesDto } from '@/dtos/user.dto';
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
    this.router.get(`${this.path}/referrers`, AuthMiddleware, RestrictTo('admin', 'moderator'), this.user.getReferrers);
    this.router.get(`${this.path}/moderators`, AuthMiddleware, RestrictTo('admin'), this.user.getModerators);
    this.router.get(`${this.path}/referrers/:id`, AuthMiddleware, RestrictTo('admin', 'moderator'), this.user.getReferrerById);
    this.router.get(`${this.path}/moderators/:id`, AuthMiddleware, RestrictTo('admin'), this.user.getModeratorById);
    this.router.patch(`${this.path}/verify/moderator/:id`, AuthMiddleware, RestrictTo('admin'), this.user.verifyModerator);
    this.router.patch(`${this.path}/verify/referrer/:id`, AuthMiddleware, RestrictTo('admin', 'moderator'), this.user.verifyReferrer);
    this.router.patch(`${this.path}/roles/:id`, ValidationMiddleware(UpdateUserRolesDto), AuthMiddleware, RestrictTo('admin'), this.user.updateRoles);
    this.router.patch(
      `${this.path}`,
      ValidationMiddleware(UpdateUserDto),
      AuthMiddleware,
      RestrictTo('admin', 'moderator', 'referrer'),
      this.user.updateUser,
    );
    this.router.delete(`${this.path}/:id`, this.user.deleteUser);
  }
}
