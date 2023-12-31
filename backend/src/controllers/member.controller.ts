import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Member, UpdateMember } from '@interfaces/member.interface';
import { MemberService } from '@services/member.service';

export class MemberController {
  public member = Container.get(MemberService);

  public findAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const role = req.user.role;
      const org = req.user.org;
      const findAllMembersData: Member[] = await this.member.findAllMembers(filter, role, org);

      res.status(200).json({ data: findAllMembersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public findMemberById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const memberId: string = req.params.id;
      const role = req.user.role;
      const org = req.user.org;
      const findOneMemberData: Member = await this.member.findMemeberById(memberId, role, org);

      res.status(200).json({ data: findOneMemberData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const memberData: Member = { ...req.body };
      const createMemberData: Member = await this.member.createMember(memberData, req.secretId, req.token);

      res.status(201).json({ data: createMemberData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateMemberStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const memberId: string = req.params.id;
      const memberData: UpdateMember = req.body;
      const referrerId: string = req.user._id;
      const updateMemberData: Member = await this.member.updateMemberStatus(memberId, referrerId, memberData);

      res.status(200).json({ data: updateMemberData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const MemberId: string = req.params.id;
      const deleteMemberData: Member = await this.member.deleteMember(MemberId);

      res.status(200).json({ data: deleteMemberData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
