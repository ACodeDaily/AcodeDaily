import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { MemberModel } from '@models/member.model';
import { ActivityModel } from '@/models/activity.model';
import { UserModel } from '@/models/user.model';
import { SecretModel } from '@/models/secret.model';
import { Member, UpdateMember, MemberFilter } from '@interfaces/member.interface';
import { CreateActivity } from '@/interfaces/activity.interface';
import { Helper } from '@utils/helper';
import { Container } from 'typedi';

@Service()
export class MemberService {
  public helper = Container.get(Helper);

  public async findAllMembers(filter: MemberFilter, role: string[], org: string): Promise<Member[]> {
    let members: Member[] = [];
    let memberQuery = MemberModel.find();
    memberQuery = memberQuery.select('-activities');

    const containsOnlyReferrer = role.every(role => role === 'referrer');

    if (containsOnlyReferrer) {
      memberQuery = memberQuery.find({ status: 'pending' });
      memberQuery = memberQuery.sort({ createdAt: filter.sort ?? -1 });
      memberQuery = memberQuery.where('org').equals(org);
    } else {
      memberQuery = memberQuery.find({ status: filter.status ?? 'pending' });
      memberQuery = memberQuery.find({ org: filter.org ?? org });
      memberQuery = memberQuery.sort({ createdAt: filter.sort ?? -1 });
    }
    members = await memberQuery;
    return members;
  }

  public async findMemeberById(memberId: string, role: string[], org: string): Promise<Member> {
    const containsOnlyReferrer = role.every(role => role === 'referrer');
    const findMember: Member = await MemberModel.findOne({ _id: memberId }).populate('activities').populate({
      path: 'secretId',
      select: 'date tokenIssuedAt',
    });
    if (!findMember) throw new HttpException(409, "Member doesn't exist");
    if (containsOnlyReferrer && findMember.status !== 'pending') throw new HttpException(409, 'Member application already resolved');
    if (org && findMember.org !== org) throw new HttpException(409, 'Member does not belong to your organization');
    return findMember;
  }

  public async createMember(memberData: Member, secretId: string, token: string): Promise<Member> {
    const isMemberExist = await MemberModel.findOne({ cfUserName: memberData.cfUserName });
    if (isMemberExist) {
      const updatedMember = await MemberModel.findByIdAndUpdate(
        isMemberExist._id,
        { cfUserName: memberData.cfUserName, status: 'pending' },
        { new: true },
      );
      if (!updatedMember) throw new HttpException(409, 'Member not found');
      await SecretModel.findOneAndUpdate({ cfUserName: memberData.cfUserName, token }, { tokenIssuedAt: 0 });
      return updatedMember;
    }
    const createMemberData: Member = await MemberModel.create({ ...memberData, secretId });
    await SecretModel.findOneAndUpdate({ cfUserName: memberData.cfUserName, token }, { tokenIssuedAt: 0 });

    return createMemberData;
  }

  public async updateMemberStatus(memberId: string, referrerId, memberData: UpdateMember): Promise<Member> {
    const isMemberExist = await MemberModel.findOne({ _id: memberId });
    if (!isMemberExist) throw new HttpException(409, "Member doesn't exist");
    if (isMemberExist.status === 'accepted' || isMemberExist.status === 'rejected')
      throw new HttpException(409, 'Member application already resolved');
    let updateMemberById: Member = await MemberModel.findByIdAndUpdate(memberId, memberData);
    if (!updateMemberById) throw new HttpException(409, "Member doesn't exist");
    const count = memberData.status === 'accepted' ? 1 : 0;
    this.helper.sendStatusUpdateToDiscord(updateMemberById);
    const activityData: CreateActivity = this.getActivityData(updateMemberById, memberData);
    const activity = await ActivityModel.create(activityData);
    const updatedUser = await UserModel.findByIdAndUpdate(
      referrerId,
      { $push: { activities: activity }, $inc: { totalReferred: count } },
      { new: true },
    );

    updateMemberById = await MemberModel.findByIdAndUpdate(memberId, { $push: { activities: activity } }, { new: true });
    if (!updatedUser) throw new HttpException(409, "Referrer doesn't exist");
    return updateMemberById;
  }

  public async deleteMember(memberId: string): Promise<Member> {
    const deleteMemberById: Member = await MemberModel.findByIdAndDelete(memberId);
    if (!deleteMemberById) throw new HttpException(409, "Member doesn't exist");

    return deleteMemberById;
  }

  private getActivityData(member: Member, memberData: UpdateMember): CreateActivity {
    return {
      email: member.email,
      cfUserName: member.cfUserName,
      status: memberData.status,
      referrerResponse: memberData.referrerResponse,
      jobId: member.jobId,
      applicationDate: member.updatedAt,
      message: member.message,
    };
  }
}
