import { Router } from 'express';
import { MemberController } from '@controllers/member.controller';
import { CreateMemberDto, UpdateMemberStatusDto } from '@dtos/member.dto';
import { Routes } from '@interfaces/route.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { VerifyToken } from '@middlewares/auth.middleware';
import { AuthMiddleware, RestrictTo, RestrictedOnlyTo } from '@middlewares/auth.middleware';

export class MemberRoute implements Routes {
  public path = '/member';
  public router = Router();
  public member = new MemberController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, AuthMiddleware, RestrictTo('admin', 'moderator', 'referrer'), this.member.findAllMembers);
    this.router.get(`${this.path}/:id`, AuthMiddleware, RestrictTo('admin', 'moderator', 'referrer'), this.member.findMemberById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateMemberDto), VerifyToken, this.member.createMember);
    this.router.patch(
      `${this.path}/status/:id`,
      AuthMiddleware,
      ValidationMiddleware(UpdateMemberStatusDto),
      RestrictedOnlyTo('referrer'),
      this.member.updateMemberStatus,
    );
    this.router.delete(`${this.path}/:id`, this.member.deleteMember);
  }
}
